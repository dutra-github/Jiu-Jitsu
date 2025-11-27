import jwt from 'jsonwebtoken';
import { models } from '../database.js';
const { User } = models;

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.userId = decoded.id;
    req.userTipo = decoded.tipo;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
