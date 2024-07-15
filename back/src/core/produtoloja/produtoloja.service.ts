import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DescricaoToUppercase } from '../../shared/decorators/descricaouppercase.decorator';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { UpdateProdutolojaDto } from './dto/update-produtoloja.dto';
import { ProdutoLoja } from './entities/produtoloja.entity';

@Injectable()
export class ProdutolojaService {
  constructor(
    @InjectRepository(ProdutoLoja)
    private readonly produtoLojaRepository: Repository<ProdutoLoja>,
  ) {}
  async findAll(): Promise<ProdutoLoja[]> {
    return await this.produtoLojaRepository.find();
  }

  async findOne(idLoja: number, idProduto: number): Promise<ProdutoLoja> {
    const produtoLoja = await this.produtoLojaRepository.findOne({
      where: {
        idLoja: idLoja,
        produto: { id: idProduto },
      },
      relations: ['produto'],
    });
    return produtoLoja;
  }

  @DescricaoToUppercase()
  async update(
    updateProdutolojaDto: UpdateProdutolojaDto,
  ): Promise<ProdutoLoja> {
    const produtoLoja = await this.produtoLojaRepository.findOne({
      where: {
        idLoja: updateProdutolojaDto.idLoja,
        produto: { id: updateProdutolojaDto.idProduto },
      },
      relations: ['produto'],
    });

    if (!produtoLoja) {
      throw new HttpException(
        EMensagem.ImpossivelAlterar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    produtoLoja.precoVenda = updateProdutolojaDto.precoVenda;
    return await this.produtoLojaRepository.save(produtoLoja);
  }

  async remove(id: number): Promise<number> {
    const produtoLoja = await this.produtoLojaRepository.findOne({
      where: { id: id },
    });

    if (!produtoLoja) {
      throw new HttpException(
        EMensagem.ImpossivelDeletar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return (await this.produtoLojaRepository.delete(id)).affected;
  }
}
