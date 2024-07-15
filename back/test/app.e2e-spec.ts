import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ExceptionsFilter } from '../src/exceptions/exceptionsfilter';
import { ResponseTransformInterceptor } from '../src/shared/interceptors/response-transform.interceptor';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
  });

  it('/ (GET)', async () => {
    const resp = await request(app.getHttpServer()).get('/');
    expect(resp).toBeDefined();
    expect(resp.body.message).toBe(null);
    expect(resp.body.data).toBe('API-Produto');
  });
});
