import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from '../../shared/classes/http-response';
import { IFindAllFilter } from '../../shared/interfaces/find-all.filter.interface';
import { IFindAllOrder } from '../../shared/interfaces/find-all.order.interface';
import { IResponse } from '../../shared/interfaces/response.interface';
import { ParseFindAllFilterPipe } from '../../shared/pipes/parse-find-all-filter.pipe';
import { ParseFindAllOrderPipe } from '../../shared/pipes/parse-find-all-order.pipe';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { FindProdutoPrecoDto } from './dto/retorna-produto-preco.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { ProdutoService } from './produto.service';

@ApiTags('produto')
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
  ): Promise<IResponse<Produto>> {
    const data = await this.produtoService.create(createProdutoDto);
    return new HttpResponse<Produto>(data).onCreated();
  }

  @Get(':page/:size/:order')
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Param('order', ParseFindAllOrderPipe) order: IFindAllOrder,
    @Query('filter', ParseFindAllFilterPipe)
    filter: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Produto[]>> {
    const data = await this.produtoService.findAll(page, size, order, filter);
    return new HttpResponse<any>(data);
  }

  @Get('preco/:page/:size/:order')
  async findWithPrecoVenda(
    @Param('page') page: number,
    @Param('size') size: number,
    @Param('order') order: string,
    @Query('precoVenda') precoVenda: number,
  ): Promise<IResponse<FindProdutoPrecoDto[]>> {
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const data = await this.produtoService.findWithPrecoVenda(
      page,
      size,
      order,
      sortOrder,
      precoVenda,
    );
    return new HttpResponse<FindProdutoPrecoDto[]>(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse<Produto>> {
    const data = await this.produtoService.findOne(+id);
    return new HttpResponse<Produto>(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<IResponse<Produto>> {
    const data = await this.produtoService.update(+id, updateProdutoDto);
    return new HttpResponse<Produto>(data).onUpdate();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse<number>> {
    const data = await this.produtoService.remove(+id);
    return new HttpResponse<number>(data).onDeleted();
  }
}
