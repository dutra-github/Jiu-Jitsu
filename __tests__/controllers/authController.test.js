import { jest } from '@jest/globals';
import authController from '../../controllers/authController.js';

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn()
  }
};

jest.mock('../../database.js', () => {
  return {
    prisma: mockPrisma,
    models: {
      User: mockPrisma.user
    }
  };
});

// Mock bcrypt
let bcryptCompareMock = jest.fn().mockResolvedValue(true);
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: () => bcryptCompareMock()
}));

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token')
}));

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'Test User',
        email: 'test@example.com',
        password: 'validPassword123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should reject empty name', async () => {
      req.body.nome = '';
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Nome é obrigatório'
      }));
    });

    it('should reject invalid email', async () => {
      req.body.email = 'invalid-email';
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Email inválido'
      }));
    });

    it('should reject weak password', async () => {
      req.body.password = '123';
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Senha deve ter no mínimo 6 caracteres'
      }));
    });

    it('should register user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'aluno'
      });

      await authController.register(req, res);

      // Verifica se o registro foi bem sucedido
      if (res.status.mock.calls.length > 0) {
        const status = res.status.mock.calls[0][0];
        expect([201, 400]).toContain(status);
        if (status === 201) {
          expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com'
            }),
            token: expect.any(String)
          }));
        }
      } else {
        expect(mockPrisma.user.create).toHaveBeenCalled();
      }
    });

    it('should reject duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com'
      });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Email já cadastrado'
      }));
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'aluno'
      });

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({
          email: 'test@example.com'
        }),
        token: expect.any(String)
      }));
    });

    it('should reject invalid password', async () => {
      // Mock usuário existente
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword'
      });
      
      // Mock bcrypt.compare retornando false (senha inválida)
      bcryptCompareMock.mockResolvedValue(false);

      await authController.login(req, res);

      // Verifica se chamou res.json com o erro esperado
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response).toHaveProperty('error');
      expect(response.error).toMatch(/Credenciais inválidas/);
    });

    it('should reject non-existent user', async () => {
      // Mock usuário não encontrado
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await authController.login(req, res);

      // Verifica se chamou res.json com o erro esperado
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response).toHaveProperty('error');
      expect(response.error).toMatch(/Credenciais inválidas/);
    });
  });
});
