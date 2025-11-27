import { jest } from '@jest/globals';

// Mock the prisma client
jest.mock('../../database.js', () => ({
  prisma: {
    aluno: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn()
    },
    historicoGraduacao: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    presenca: {
      create: jest.fn(),
      count: jest.fn()
    },
    requisitoGraduacao: {
      findFirst: jest.fn()
    }
  }
}));

// Import controller after mocking dependencies
import alunoController from '../../controllers/alunoController.js';

describe('Aluno Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'João Silva',
        email: 'joao@example.com',
        dataNascimento: '1990-01-01',
        telefone: '11999999999',
        faixa: 'branca',
        grau: 0
      },
      params: {
        id: '1'
      },
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criarAluno', () => {
    it('should create a new aluno successfully', async () => {
      const { prisma } = await import('../../database.js');
      
      const mockAluno = { 
        id: 1, 
        nome: 'João Silva',
        email: 'joao@example.com',
        faixa: 'branca', 
        grau: 0 
      };
      
      prisma.aluno.create.mockResolvedValue(mockAluno);

      await alunoController.criarAluno(req, res);

      expect(prisma.aluno.create).toHaveBeenCalledWith({ data: expect.any(Object) });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAluno);
    });

    it('should return error if creation fails', async () => {
      const { prisma } = await import('../../database.js');
      
      prisma.aluno.create.mockRejectedValue(new Error('Creation failed'));

      await alunoController.criarAluno(req, res);

      expect(prisma.aluno.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('listarAlunos', () => {
    it('should list all alunos with filters', async () => {
      const { prisma } = await import('../../database.js');
      
      req.query = { ativo: 'true', faixa: 'branca' };
      
      const mockAlunos = [
        { id: 1, nome: 'João', faixa: 'branca', grau: 0, ativo: true },
        { id: 2, nome: 'Maria', faixa: 'branca', grau: 2, ativo: true }
      ];
      
      prisma.aluno.findMany.mockResolvedValue(mockAlunos);

      await alunoController.listarAlunos(req, res);

      expect(prisma.aluno.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          ativo: true,
          faixa: 'branca'
        })
      });
      expect(res.json).toHaveBeenCalledWith(mockAlunos);
    });
  });

  describe('obterAluno', () => {
    it('should get aluno by id', async () => {
      const { prisma } = await import('../../database.js');
      
      const mockAluno = { 
        id: 1, 
        nome: 'João Silva',
        faixa: 'branca', 
        grau: 0 
      };
      
      prisma.aluno.findUnique.mockResolvedValue(mockAluno);

      await alunoController.obterAluno(req, res);

      expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(res.json).toHaveBeenCalledWith(mockAluno);
    });

    it('should return 404 when aluno not found', async () => {
      const { prisma } = await import('../../database.js');
      
      prisma.aluno.findUnique.mockResolvedValue(null);

      await alunoController.obterAluno(req, res);

      expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('registrarAula', () => {
    it('should increase aulasDesdeUltGrad when registering aula', async () => {
      const { prisma } = await import('../../database.js');
      
      const mockAluno = { 
        id: 1, 
        nome: 'João Silva',
        faixa: 'branca', 
        grau: 0,
        aulasDesdeUltGrad: 10
      };
      
      prisma.aluno.findUnique.mockResolvedValue(mockAluno);
      prisma.aluno.update.mockResolvedValue({
        ...mockAluno,
        aulasDesdeUltGrad: 11
      });
      prisma.presenca.create.mockResolvedValue({ id: 1 });

      // Add aula information to the request
      req.body = { aulaId: 1, data: new Date().toISOString() };

      await alunoController.registrarAula(req, res);

      expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prisma.aluno.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          aulasDesdeUltGrad: 11
        })
      });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        aulasDesdeUltGrad: 11
      }));
    });
  });

  describe('atualizarGraduacao', () => {
    it('should update the aluno graduation', async () => {
      const { prisma } = await import('../../database.js');
      
      const mockAluno = { 
        id: 1, 
        nome: 'João Silva',
        faixa: 'branca', 
        grau: 4,
        aulasDesdeUltGrad: 40
      };
      
      req.body = {
        faixa: 'azul',
        grau: 0
      };
      
      prisma.aluno.findUnique.mockResolvedValue(mockAluno);
      prisma.aluno.update.mockResolvedValue({
        ...mockAluno,
        faixa: 'azul',
        grau: 0,
        aulasDesdeUltGrad: 0
      });
      
      prisma.historicoGraduacao.create.mockResolvedValue({
        id: 1,
        faixaAnterior: 'branca',
        grauAnterior: 4,
        faixaNova: 'azul',
        grauNovo: 0
      });

      await alunoController.atualizarGraduacao(req, res);

      expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prisma.aluno.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          faixa: 'azul',
          grau: 0,
          aulasDesdeUltGrad: 0
        })
      });
      expect(prisma.historicoGraduacao.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          alunoId: 1,
          faixaAnterior: 'branca',
          grauAnterior: 4,
          faixaNova: 'azul',
          grauNovo: 0
        })
      });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        faixa: 'azul',
        grau: 0
      }));
    });
  });

  describe('obterHistorico', () => {
    it('should get graduation history for an aluno', async () => {
      const { prisma } = await import('../../database.js');
      
      const mockAluno = { 
        id: 1, 
        nome: 'João Silva',
        faixa: 'azul',
        grau: 2
      };
      
      const mockHistorico = [
        {
          id: 1,
          faixaAnterior: 'branca',
          grauAnterior: 4,
          faixaNova: 'azul',
          grauNovo: 0,
          dataGraduacao: new Date('2023-01-01')
        },
        {
          id: 2,
          faixaAnterior: 'azul',
          grauAnterior: 0,
          faixaNova: 'azul',
          grauNovo: 1,
          dataGraduacao: new Date('2023-06-01')
        }
      ];
      
      prisma.aluno.findUnique.mockResolvedValue(mockAluno);
      prisma.historicoGraduacao.findMany.mockResolvedValue(mockHistorico);

      await alunoController.obterHistorico(req, res);

      expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prisma.historicoGraduacao.findMany).toHaveBeenCalledWith({
        where: { alunoId: 1 },
        orderBy: { dataGraduacao: 'desc' }
      });
      expect(res.json).toHaveBeenCalledWith({
        aluno: mockAluno,
        historico: mockHistorico
      });
    });
  });
});
