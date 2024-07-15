import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from '../../shared/classes/http-response';
import { IResponse } from '../../shared/interfaces/response.interface';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from './entities/loja.entity';
import { LojaService } from './loja.service';

@ApiTags('loja')
@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Post()
  async create(@Body() createLojaDto: CreateLojaDto): Promise<IResponse<Loja>> {
    const data = await this.lojaService.create(createLojaDto);
    return new HttpResponse<Loja>(data).onCreated();
  }

  @Get()
  async findAll(): Promise<IResponse<Loja[]>> {
    const data = await this.lojaService.findAll();
    return new HttpResponse<Loja[]>(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse<Loja>> {
    const data = await this.lojaService.findOne(+id);
    return new HttpResponse<Loja>(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLojaDto: UpdateLojaDto,
  ): Promise<IResponse<Loja>> {
    const data = await this.lojaService.update(+id, updateLojaDto);
    return new HttpResponse<Loja>(data).onUpdate();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse<number>> {
    const data = await this.lojaService.remove(+id);
    return new HttpResponse<number>(data).onDeleted();
  }
}
