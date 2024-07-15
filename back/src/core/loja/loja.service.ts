import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from './entities/loja.entity';

@Injectable()
export class LojaService {
  constructor(
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
  ) {}

  async create(createLojaDto: CreateLojaDto): Promise<Loja> {
    const finded = await this.lojaRepository.findOne({
      where: { descricao: createLojaDto.descricao },
    });

    if (finded) {
      throw new HttpException(
        EMensagem.ImpossivelCadastrar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const created = this.lojaRepository.create(createLojaDto);
    return await this.lojaRepository.save(created);
  }

  async findAll(): Promise<Loja[]> {
    return await this.lojaRepository.find();
  }

  async findOne(id: number): Promise<Loja> {
    return await this.lojaRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateLojaDto: UpdateLojaDto): Promise<Loja> {
    const finded = await this.lojaRepository.findOne({
      where: { id: id },
    });

    if (!finded || updateLojaDto.id === undefined) {
      throw new HttpException(
        EMensagem.ImpossivelAlterar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (id !== updateLojaDto.id) {
      throw new HttpException(
        EMensagem.IDsDiferentes,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.lojaRepository.save(updateLojaDto);
  }

  async remove(id: number): Promise<number> {
    const finded = await this.lojaRepository.findOne({
      where: { id: id },
    });
    if (!finded) {
      throw new HttpException(
        EMensagem.ImpossivelDeletar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return (await this.lojaRepository.delete(id)).affected;
  }
}
