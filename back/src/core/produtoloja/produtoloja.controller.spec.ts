import { Test, TestingModule } from '@nestjs/testing';
import { ProdutolojaController } from './produtoloja.controller';
import { ProdutolojaService } from './produtoloja.service';

describe('ProdutolojaController', () => {
  let controller: ProdutolojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutolojaController],
      providers: [ProdutolojaService],
    }).compile();

    controller = module.get<ProdutolojaController>(ProdutolojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
