import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from '../../shared/classes/http-response';
import { IResponse } from '../../shared/interfaces/response.interface';
import { UpdateProdutolojaDto } from './dto/update-produtoloja.dto';
import { ProdutoLoja } from './entities/produtoloja.entity';
import { ProdutolojaService } from './produtoloja.service';

@ApiTags('produtoloja')
@Controller('produtoloja')
export class ProdutolojaController {
  constructor(private readonly produtolojaService: ProdutolojaService) {}

  @Get()
  async findAll(): Promise<IResponse<ProdutoLoja[]>> {
    const data = await this.produtolojaService.findAll();
    return new HttpResponse<ProdutoLoja[]>(data);
  }

  @Get(':idLoja/:idProduto')
  async findOne(
    @Param('idLoja') idLoja: string,
    @Param('idProduto') idProduto: string,
  ): Promise<IResponse<ProdutoLoja>> {
    const data = await this.produtolojaService.findOne(+idLoja, +idProduto);
    return new HttpResponse<ProdutoLoja>(data);
  }

  @Patch()
  async update(
    @Body() updateProdutolojaDto: UpdateProdutolojaDto,
  ): Promise<IResponse<ProdutoLoja>> {
    const data = await this.produtolojaService.update(updateProdutolojaDto);
    return new HttpResponse<ProdutoLoja>(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse<number>> {
    const data = await this.produtolojaService.remove(+id);
    return new HttpResponse<number>(data).onDeleted();
  }
}
