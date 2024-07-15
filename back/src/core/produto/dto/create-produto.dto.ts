import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateProdutolojaDto } from '../../produtoloja/dto/create-produtoloja.dto';

export class CreateProdutoDto {
  @IsEmpty({ message: `ID ${EMensagem.DeveSerVazio}` })
  id: number;

  @IsNotEmpty({ message: `Campo descrição ${EMensagem.NaoPodeSerVazio}` })
  @MaxLength(60, {
    message: `Campo descrição ${EMensagem.MaisCaracteresQuePermitido}`,
  })
  descricao: string;

  @IsOptional()
  @IsNumber()
  custo: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProdutolojaDto)
  @IsArray()
  produtoLoja?: CreateProdutolojaDto[];
}
