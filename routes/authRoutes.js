import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota de registro
router.post('/register', authController.register);

// Rota de login  
router.post('/login', authController.login);

// Rota para obter dados do usuário autenticado
router.get('/me', authMiddleware, authController.me);

// Rota para renovar token
router.post('/refresh-token', authController.refreshToken);

export default router;
