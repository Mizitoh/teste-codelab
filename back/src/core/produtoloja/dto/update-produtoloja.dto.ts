import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateProdutolojaDto } from './create-produtoloja.dto';

export class UpdateProdutolojaDto extends PartialType(CreateProdutolojaDto) {
  @IsOptional()
  @IsNumber()
  precoVenda?: number;

  @IsNotEmpty({ message: `ID de loja ${EMensagem.NaoPodeSerVazio}` })
  idLoja: number;

  @IsNotEmpty({ message: `ID de produto ${EMensagem.NaoPodeSerVazio}` })
  idProduto: number;
}
