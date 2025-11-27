import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 8);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@example.com',
      password: adminPassword
    }
  });
  console.log('Usuário admin criado:', admin.email);

  // Criar usuário de teste
  const userPassword = await bcrypt.hash('123456', 8);
  const user = await prisma.user.upsert({
    where: { email: 'usuario@example.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'usuario@example.com',
      password: userPassword
    }
  });
  console.log('Usuário teste criado:', user.email);

  // Criar alunos de exemplo
  const aluno1 = await prisma.aluno.upsert({
    where: { email: 'aluno1@example.com' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'aluno1@example.com',
      dataNascimento: new Date('1990-01-15'),
      telefone: '(11) 98765-4321',
      faixa: 'azul',
      grau: 2,
      dataInicio: new Date('2020-03-10'),
      ativo: true
    }
  });
  console.log('Aluno criado:', aluno1.nome);

  const aluno2 = await prisma.aluno.upsert({
    where: { email: 'aluno2@example.com' },
    update: {},
    create: {
      nome: 'Maria Oliveira',
      email: 'aluno2@example.com',
      dataNascimento: new Date('1995-07-22'),
      telefone: '(11) 91234-5678',
      faixa: 'branca',
      grau: 4,
      dataInicio: new Date('2022-01-05'),
      ativo: true
    }
  });
  console.log('Aluno criado:', aluno2.nome);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
