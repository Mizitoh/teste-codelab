import { IsNotEmpty, MaxLength } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';

export class CreateLojaDto {
  @IsNotEmpty({ message: `Nome ${EMensagem.NaoPodeSerVazio}` })
  @MaxLength(60, { message: `Nome ${EMensagem.MaisCaracteresQuePermitido}` })
  descricao: string;
}
