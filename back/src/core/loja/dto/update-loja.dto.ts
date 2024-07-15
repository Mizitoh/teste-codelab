import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateLojaDto } from './create-loja.dto';

export class UpdateLojaDto extends PartialType(CreateLojaDto) {
  @IsNotEmpty({ message: `ID ${EMensagem.NaoPodeSerVazio}` })
  id: number;
}
