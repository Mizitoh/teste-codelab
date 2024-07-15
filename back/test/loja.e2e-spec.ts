import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Loja } from '../src/core/loja/entities/loja.entity';
import { ExceptionsFilter } from '../src/exceptions/exceptionsfilter';
import { EMensagem } from '../src/shared/enums/mensagem.enum';
import { ResponseTransformInterceptor } from '../src/shared/interceptors/response-transform.interceptor';
import { generateRandomName } from './datagenerator';

describe('LojaController (e2e)', () => {
  let app: INestApplication;

  let repositoryLoja: Repository<Loja>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new ExceptionsFilter());

    await app.startAllMicroservices();
    await app.init();

    repositoryLoja = app.get<Repository<Loja>>(getRepositoryToken(Loja));
  });

  afterAll(async () => {
    await repositoryLoja.delete({});
    await app.close();
  });

  describe('CRUD /loja', () => {
    const loja = { descricao: generateRandomName() };
    let id: number;

    it('criar uma loja', async () => {
      const resp = await request(app.getHttpServer()).post('/loja').send(loja);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.SalvoSucesso);
      expect(resp.body.data).toHaveProperty('id');

      id = resp.body.data.id;
    });

    it('exceção ao criar uma loja duplicada', async () => {
      const resp = await request(app.getHttpServer()).post('/loja').send(loja);
      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelCadastrar);
      expect(resp.body.data).toBe(null);
    });

    it('carregar uma loja', async () => {
      const resp = await request(app.getHttpServer()).get(`/loja/${id}`);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.id).toBe(id);
      expect(resp.body.data.descricao).toBe(loja.descricao);
    });

    it('atualizar uma loja', async () => {
      const lojaUpdated = Object.assign(loja, {
        id: id,
        descricao: generateRandomName(),
      });
      const resp = await request(app.getHttpServer())
        .patch(`/loja/${id}`)
        .send(lojaUpdated);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.AtualizadoSucesso);
      expect(resp.body.data.id).toBe(id);
      expect(resp.body.data.descricao).toBe(lojaUpdated.descricao);
    });

    it('exceção ao atualizar uma loja com ids diferentes', async () => {
      const lojaUpdated = Object.assign(loja, {
        id: id,
        descricao: generateRandomName(),
      });
      const resp = await request(app.getHttpServer())
        .patch(`/loja/-10`)
        .send(lojaUpdated);
      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.IDsDiferentes);
      expect(resp.body.data).toBe(null);
    });

    it('exceção ao atualizar uma loja com id inexistente', async () => {
      const lojaWithoutID = { descricao: generateRandomName() };
      const resp = await request(app.getHttpServer())
        .patch(`/loja/${id}`)
        .send(lojaWithoutID);
      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelAlterar);
      expect(resp.body.data).toBe(null);
    });

    it('exclui uma loja', async () => {
      const resp = await request(app.getHttpServer()).delete(`/loja/${id}`);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.DeletadoSucesso);
      expect(!isNaN(resp.body.data)).toBe(true);
    });

    it('exceção ao exclui uma loja não encontrada', async () => {
      const resp = await request(app.getHttpServer()).delete(`/loja/-10`);
      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelDeletar);
      expect(resp.body.data).toBe(null);
    });
  });

  describe('findAll /loja', () => {
    it('Obter todas as lojas', async () => {
      for (let index = 0; index < 10; index++) {
        const loja = { descricao: generateRandomName() };
        await request(app.getHttpServer()).post('/loja').send(loja);
      }
      const resp = await request(app.getHttpServer()).get(`/loja`);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(null);
      expect(resp.body.data.length).toBeGreaterThan(5);
    });
  });
});
