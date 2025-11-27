import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import alunoRoutes from './routes/alunoRoutes.js';
import metricasRoutes from './routes/metricasRoutes.js';
import authRoutes from './routes/authRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import aulaRoutes from './routes/aulaRoutes.js';
import tipoAulaRoutes from './routes/tipoAulaRoutes.js';
import arteMarcialRoutes from './routes/arteMarcialRoutes.js';

const app = express();
const prisma = new PrismaClient();
// Usa porta da variável de ambiente ou 3200 como fallback
const PORT = process.env.PORT || 3200;

// Middleware
app.use(cors({
  origin: ['http://localhost:3201', 'http://127.0.0.1:3201'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/tipos-aulas', tipoAulaRoutes);
app.use('/api/artes-marciais', arteMarcialRoutes);
app.use('/api/metricas', metricasRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando corretamente!' });
});

// Rota raiz da API
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API do Sistema de Gerenciamento para Academias de Jiu-Jitsu',
    endpoints: [
      '/api/auth',
      '/api/alunos',
      '/api/metricas',
      '/api/dashboard',
      '/api/health'
    ]
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor com tratamento de erro de porta ocupada
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Erro: Porta ${PORT} já está em uso.`);
    console.log('Tente:');
    console.log(`1. Usar uma porta diferente configurando a variável PORT`);
    console.log(`2. Encerrar o processo que está usando a porta ${PORT}`);
    console.log(`3. Esperar alguns segundos e tentar novamente`);
    process.exit(1);
  } else {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
});

// Tratamento de encerramento
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexão com o banco de dados fechada');
  process.exit(0);
});
