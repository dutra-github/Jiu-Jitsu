import jwt from 'jsonwebtoken';
import { prisma } from '../database.js';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role || 'aluno';

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
