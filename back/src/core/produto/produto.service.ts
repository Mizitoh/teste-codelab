import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DescricaoToUppercase } from '../../shared/decorators/descricaouppercase.decorator';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { handleFilter } from '../../shared/helpers/sql.helper';
import { IFindAllFilter } from '../../shared/interfaces/find-all.filter.interface';
import { IFindAllOrder } from '../../shared/interfaces/find-all.order.interface';
import { ProdutoLoja } from '../produtoloja/entities/produtoloja.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { FindProdutoPrecoDto } from './dto/retorna-produto-preco.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoLoja)
    private readonly produtoLojaRepository: Repository<ProdutoLoja>,
  ) {}
  @DescricaoToUppercase()
  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const finded = await this.produtoRepository.findOne({
      where: { descricao: createProdutoDto.descricao },
    });

    if (finded) {
      throw new HttpException(
        EMensagem.ImpossivelAlterar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const produtoNovo = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produtoNovo);
  }

  async findAll(
    page: number,
    size: number,
    order: IFindAllOrder,
    filter?: IFindAllFilter | IFindAllFilter[],
  ) {
    page--;

    const where = handleFilter(filter);

    const [produto, total] = await this.produtoRepository.findAndCount({
      order: { [order.column]: order.sort },
      where,
      skip: size * page,
      take: size,
    });

    return { produto, total };
  }

  async findWithPrecoVenda(
    page: number,
    size: number,
    orderColumn: string,
    sortOrder: 'ASC' | 'DESC',
    precoVenda: number,
  ): Promise<FindProdutoPrecoDto[]> {
    const skip = size * (page - 1);

    const query = `
      SELECT
        "Produto"."id" AS "id",
        "Produto"."descricao" AS "descricao",
        "Produto"."custo" AS "custo",
        "Produto__produtoLoja"."id" AS "produtoloja_id",
        "Produto__produtoLoja"."idLoja" AS "idLoja",
        "Produto__produtoLoja"."precoVenda" AS "precovenda"
      FROM
        "produto" "Produto"
      LEFT JOIN
        "produtoloja" "Produto__produtoLoja" ON "Produto__produtoLoja"."idProduto" = "Produto"."id"
      WHERE
        "Produto__produtoLoja"."precoVenda"::varchar ILIKE '%${precoVenda}%'
      ORDER BY
        "${orderColumn}" ${sortOrder}
      LIMIT
        ${size} OFFSET ${skip}
    `;

    const result = await this.produtoRepository.query(query);

    const produtosDto: FindProdutoPrecoDto[] = result.map((row) => ({
      id: row.id,
      descricao: row.descricao,
      custo: row.custo,
      produtoLoja: [
        {
          id: row.produtoloja_id,
          idLoja: row.idLoja,
          precoVenda: row.precovenda,
        },
      ],
    }));

    return produtosDto;
  }

  async findOne(id: number): Promise<Produto> {
    return await this.produtoRepository.findOne({
      where: { id: id },
    });
  }

  @DescricaoToUppercase()
  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    if (id !== updateProdutoDto.id) {
      throw new HttpException(
        EMensagem.IDsDiferentes,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const finded = await this.produtoRepository.findOne({
      select: ['id'],
      where: { descricao: updateProdutoDto.descricao.toUpperCase() },
    });

    if (finded && finded.id !== id) {
      throw new HttpException(
        EMensagem.ImpossivelAlterar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    delete updateProdutoDto.produtoLoja;
    return await this.produtoRepository.save(updateProdutoDto);
  }

  async remove(id: number): Promise<number> {
    const produto = await this.produtoRepository.findOne({
      where: { id: id },
    });

    if (!produto) {
      throw new HttpException(
        EMensagem.ImpossivelDeletar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const produtoLoja = await this.produtoLojaRepository.find({
      where: {
        produto: { id: id },
      },
      relations: ['produto'],
    });

    for (const pl of produtoLoja) {
      if (pl) {
        await this.produtoLojaRepository.delete(pl.id);
      }
    }
    return (await this.produtoRepository.delete(id)).affected;
  }
}
