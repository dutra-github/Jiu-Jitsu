import { jest } from '@jest/globals'
import authMiddleware from '../../middlewares/authMiddleware.js'
import jwt from 'jsonwebtoken'

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

// Mock database
const mockPrisma = {
  user: {
    findFirst: jest.fn()
  }
};

jest.mock('../../database.js', () => ({
  prisma: mockPrisma
}));

// Make prisma available for all tests
let prisma;
beforeAll(async () => {
  prisma = (await import('../../database.js')).prisma;
});

describe('Auth Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      headers: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if no token is provided', async () => {
    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid-token'
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next if token is valid', async () => {
    req.headers.authorization = 'Bearer valid-token'
    jwt.verify.mockReturnValue({ id: 1 })

    await authMiddleware(req, res, next)

    expect(req.userId).toBe(1)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
