import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const models = {
  User: prisma.user,
  Aluno: prisma.aluno,
  Mensalidade: prisma.mensalidade,
  Presenca: prisma.presenca,
  Graduacao: prisma.graduacao
};

// Tratamento de encerramento
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexão com o banco de dados fechada');
  process.exit(0);
});
