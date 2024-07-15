import { Test, TestingModule } from '@nestjs/testing';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';

describe('LojaController', () => {
  let controller: LojaController;
  let serviceLoja: LojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
      providers: [
        {
          provide: LojaService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LojaController>(LojaController);
    serviceLoja = module.get<LojaService>(LojaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('criar nova loja', async () => {
      const createLojaDto = { descricao: 'loja teste' };
      const mockLoja = Object.assign(createLojaDto, { id: 1 });
      const spyServiceCreate = jest
        .spyOn(serviceLoja, 'create')
        .mockReturnValue(Promise.resolve(mockLoja));
      const response = await controller.create(createLojaDto);
      expect(spyServiceCreate).toHaveBeenCalled();
      expect(response.data).toEqual(mockLoja);
      expect(response.message).toBe(EMensagem.SalvoSucesso);
    });
  });
  describe('findAll', () => {
    it('carregar lista de lojas', async () => {
      const mocklistaLojas = [{ id: 1, descricao: 'loja teste' }];
      const spyServiceFind = jest
        .spyOn(serviceLoja, 'findAll')
        .mockReturnValue(Promise.resolve(mocklistaLojas));
      const response = await controller.findAll();
      expect(spyServiceFind).toHaveBeenCalled();
      expect(response.data).toEqual(mocklistaLojas);
      expect(response.message).toBe(undefined);
    });
  });
  describe('findOne', () => {
    it('carregar uma loja', async () => {
      const mockLoja = { id: 1, descricao: 'loja teste' };
      const spyServiceFind = jest
        .spyOn(serviceLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLoja));
      const response = await controller.findOne('1');
      expect(spyServiceFind).toHaveBeenCalled();
      expect(response.data).toEqual(mockLoja);
      expect(response.message).toBe(undefined);
    });
  });
  describe('update', () => {
    it('atualiza uma loja', async () => {
      const mockLoja = { id: 1, descricao: 'loja teste' };

      const spyServiceUpdate = jest
        .spyOn(serviceLoja, 'update')
        .mockReturnValue(Promise.resolve(mockLoja));

      const response = await controller.update('1', mockLoja);
      expect(spyServiceUpdate).toHaveBeenCalled();
      expect(response.data).toEqual(mockLoja);
      expect(response.message).toBe(EMensagem.AtualizadoSucesso);
    });
  });
  describe('delete', () => {
    it('deleta uma loja', async () => {
      const spyServiceDelete = jest
        .spyOn(serviceLoja, 'remove')
        .mockReturnValue(Promise.resolve(Number) as any);

      const response = await controller.remove('1');
      expect(spyServiceDelete).toHaveBeenCalled();
      expect(response.data).toEqual(Number);
      expect(response.message).toBe(EMensagem.DeletadoSucesso);
    });
  });
});
