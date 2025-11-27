import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../database.js';

// Função auxiliar para gerar tokens JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role || 'aluno' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const authController = {

  async register(req, res) {
    try {
      const { nome, email, password } = req.body;

      // Validações
      if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
      }

      const userExists = await prisma.user.findUnique({ 
        where: { email } 
      });
      
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await prisma.user.create({ 
        data: { 
          name: nome, 
          email, 
          password: hashedPassword 
        } 
      });

      // Não enviar a senha
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        user: userWithoutPassword,
        token: generateToken(user)
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(400).json({ 
        error: 'Erro ao registrar usuário',
        details: error.message 
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await prisma.user.findUnique({ 
        where: { email } 
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Não enviar a senha
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        user: userWithoutPassword,
        token: generateToken(user)
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(400).json({ 
        error: 'Erro ao fazer login',
        details: error.message 
      });
    }
  },

  async me(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Não enviar a senha
      const { password: _, ...userWithoutPassword } = user;

      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(400).json({ 
        error: 'Erro ao buscar usuário',
        details: error.message 
      });
    }
  },
  
  // Novo método para renovar tokens
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token não fornecido' });
      }
      
      // Verificar se o refresh token é válido para um usuário
      const user = await prisma.user.findFirst({
        where: { refreshToken }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Refresh token inválido' });
      }
      
      // Gerar novo token de acesso
      const token = generateToken(user);
      
      return res.json({ token });
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return res.status(400).json({ error: 'Erro ao renovar token' });
    }
  }
};

export default authController;
