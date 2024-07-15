import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateProdutoDto } from '../../produto/dto/create-produto.dto';

export class CreateProdutolojaDto {
  @IsOptional()
  @IsNumber()
  precoVenda?: number;

  @IsNotEmpty({ message: `ID da loja ${EMensagem.NaoPodeSerVazio}` })
  idLoja: number;

  @ValidateNested()
  @Type(() => CreateProdutoDto)
  produto: CreateProdutoDto;
}
