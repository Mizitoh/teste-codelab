import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoLoja } from './entities/produtoloja.entity';
import { ProdutolojaController } from './produtoloja.controller';
import { ProdutolojaService } from './produtoloja.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoLoja])],
  controllers: [ProdutolojaController],
  providers: [ProdutolojaService],
})
export class ProdutolojaModule {}
