import { Test, TestingModule } from '@nestjs/testing';
import { ProdutolojaService } from './produtoloja.service';

describe('ProdutolojaService', () => {
  let service: ProdutolojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutolojaService],
    }).compile();

    service = module.get<ProdutolojaService>(ProdutolojaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
