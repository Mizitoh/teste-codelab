import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Loja } from '../src/core/loja/entities/loja.entity';
import { Produto } from '../src/core/produto/entities/produto.entity';
import { ProdutoLoja } from '../src/core/produtoloja/entities/produtoloja.entity';
import { EMensagem } from '../src/shared/enums/mensagem.enum';
import { ResponseTransformInterceptor } from '../src/shared/interceptors/response-transform.interceptor';
import { generateRandomName, generateRandomPrices } from './datagenerator';

describe('ProdutoLojaController (e2e)', () => {
  let app: INestApplication;

  let repositoryProdutoLoja: Repository<ProdutoLoja>;
  let repositoryLoja: Repository<Loja>;
  let repositoryProduto: Repository<Produto>;

  let loja: Loja;
  let produto: Produto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());

    await app.init();

    repositoryLoja = moduleFixture.get<Repository<Loja>>(
      getRepositoryToken(Loja),
    );
    repositoryProduto = moduleFixture.get<Repository<Produto>>(
      getRepositoryToken(Produto),
    );
    repositoryProdutoLoja = moduleFixture.get<Repository<ProdutoLoja>>(
      getRepositoryToken(ProdutoLoja),
    );

    loja = await repositoryLoja.save(
      repositoryLoja.create({ descricao: 'Loja 1' }),
    );

    produto = await repositoryProduto.save(
      repositoryProduto.create({
        descricao: generateRandomName(),
        custo: generateRandomPrices(),
        produtoLoja: [{ idLoja: loja.id, precoVenda: generateRandomPrices() }],
      }),
    );
  });

  afterAll(async () => {
    await repositoryProdutoLoja.delete({});
    await repositoryProduto.delete({});
    await repositoryLoja.delete({});
    await app.close();
  });

  describe('CRUD /produtoloja', () => {
    it('carregar um produtoLoja', async () => {
      const resp = await request(app.getHttpServer()).get(
        `/produtoloja/${loja.id}/${produto.id}`,
      );
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.id).toBe(produto.produtoLoja[0].id);
    });

    it('atualizar produtoLoja', async () => {
      const produtoLojaUpdated = {
        idLoja: loja.id,
        idProduto: produto.id,
        precoVenda: generateRandomPrices(),
      };
      const resp = await request(app.getHttpServer())
        .patch(`/produtoloja`)
        .send(produtoLojaUpdated);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.idLoja).toBe(produtoLojaUpdated.idLoja);
      expect(resp.body.data.precoVenda).toBe(produtoLojaUpdated.precoVenda);
    });

    it('exceção ao atualizar um produtoloja com ids diferentes', async () => {
      const produtoLojaUpdated = {
        idLoja: -10,
        idProduto: produto.id,
        precoVenda: generateRandomPrices(),
      };
      const resp = await request(app.getHttpServer())
        .patch(`/produtoloja`)
        .send(produtoLojaUpdated);
      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelAlterar);
      expect(resp.body.data).toBe(undefined);
    });

    it('exclui um produtoLoja', async () => {
      const resp = await request(app.getHttpServer()).delete(
        `/produtoloja/${produto.produtoLoja[0].id}`,
      );
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.DeletadoSucesso);
      expect(!isNaN(resp.body.data)).toBe(true);
    });
  });

  describe('findAll /produtoloja', () => {
    it('Obter todos produtos loja', async () => {
      for (let index = 0; index < 10; index++) {
        await repositoryProduto.save(
          repositoryProduto.create({
            descricao: generateRandomName(),
            custo: generateRandomPrices(),
            produtoLoja: [
              { idLoja: loja.id, precoVenda: generateRandomPrices() },
            ],
          }),
        );
      }
      const resp = await request(app.getHttpServer()).get(`/produtoloja`);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.length).toBeGreaterThan(5);
    });
  });
});
