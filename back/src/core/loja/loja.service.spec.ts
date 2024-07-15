import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { Loja } from './entities/loja.entity';
import { LojaService } from './loja.service';

describe('LojaService', () => {
  let service: LojaService;
  let repositoryLoja: Repository<Loja>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojaService,
        {
          provide: getRepositoryToken(Loja),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LojaService>(LojaService);
    repositoryLoja = module.get<Repository<Loja>>(getRepositoryToken(Loja));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('criar uma nova loja', async () => {
      const createLojaDto = { descricao: 'loja 1' };
      const mockLoja = Object.assign(createLojaDto, { id: 1 });

      const spyRepositorySave = jest
        .spyOn(repositoryLoja, 'save')
        .mockReturnValue(Promise.resolve(mockLoja));

      const response = await service.create(createLojaDto);

      expect(response).toEqual(mockLoja);
      expect(spyRepositorySave).toHaveBeenCalled();
    });
    it('exceção ao criar uma nova loja com nome repetido', async () => {
      const mockLoja = { id: 1, descricao: 'loja 1' };

      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLoja));

      try {
        await service.create(mockLoja);
      } catch (error: any) {
        expect(error.message).toBe(EMensagem.ImpossivelCadastrar);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
  });
  describe('findAll', () => {
    it('carregar todas as lojas', async () => {
      const mockLojaLista = [{ id: 1, descricao: 'loja 1' }];

      const spyRepositoryFind = jest
        .spyOn(repositoryLoja, 'find')
        .mockReturnValue(Promise.resolve(mockLojaLista));

      const response = await service.findAll();

      expect(response).toEqual(mockLojaLista);
      expect(spyRepositoryFind).toHaveBeenCalled();
    });
    it('carregar uma lojas pelo id', async () => {
      const mockLojaLista = { id: 1, descricao: 'loja 1' };

      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLojaLista));

      const response = await service.findOne(1);

      expect(response).toEqual(mockLojaLista);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('atualiza uma loja', async () => {
      const updateLojaDTO = { id: 1, descricao: 'loja 1' };

      const mockLoja = Object.assign(updateLojaDTO, {});

      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLoja));

      const spyRepositorySave = jest
        .spyOn(repositoryLoja, 'save')
        .mockReturnValue(Promise.resolve(mockLoja));

      const response = await service.update(1, updateLojaDTO);
      expect(response).toEqual(mockLoja);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
      expect(spyRepositorySave).toHaveBeenCalled();
    });
    it('exceção ao atualizar lojas com ids diferentes', async () => {
      const updateLojaDTO = { id: 1, descricao: 'loja 1' };

      const mockLoja = Object.assign(updateLojaDTO, {});

      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLoja));

      try {
        await service.update(-10, updateLojaDTO);
      } catch (error: any) {
        expect(error.message).toBe(EMensagem.IDsDiferentes);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
    it('exceção ao atualizar lojas sem id no objeto', async () => {
      const updateLojaDTO = { id: undefined, descricao: 'loja 1' };
      const mockLoja = { id: 1, descricao: 'loja 1' };

      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(mockLoja));

      try {
        await service.update(-10, updateLojaDTO);
      } catch (error: any) {
        expect(error.message).toBe(EMensagem.ImpossivelAlterar);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
  });
  describe('delete', () => {
    it('deleta uma loja', async () => {
      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockResolvedValueOnce(1 as any);

      const spyRepositoryDelete = jest
        .spyOn(repositoryLoja, 'delete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const response = await service.remove(1);

      expect(typeof response).toBe('number');
      expect(spyRepositoryFindOne).toHaveBeenCalled();
      expect(spyRepositoryDelete).toHaveBeenCalled();
    });
    it('exceção ao deletar loja não encontrada', async () => {
      const spyRepositoryFindOne = jest
        .spyOn(repositoryLoja, 'findOne')
        .mockReturnValue(Promise.resolve(null) as any);

      try {
        await service.remove(1);
      } catch (error: any) {
        expect(error.message).toBe(EMensagem.ImpossivelDeletar);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
  });
});
