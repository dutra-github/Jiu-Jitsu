import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding test database...');
  
  // Clear existing data
  await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;
  await prisma.presenca.deleteMany();
  await prisma.mensalidade.deleteMany();
  await prisma.historicoGraduacao.deleteMany();
  await prisma.graduacao.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.requisitoGraduacao.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plano.deleteMany();
  await prisma.perfil.deleteMany();
  await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
  
  // Criar perfis
  const adminPerfil = await prisma.perfil.create({
    data: {
      nome: 'Administrador',
      descricao: 'Acesso total ao sistema'
    }
  });
  
  const professorPerfil = await prisma.perfil.create({
    data: {
      nome: 'Professor',
      descricao: 'Acesso à gestão de alunos e aulas'
    }
  });
  
  const alunoPerfil = await prisma.perfil.create({
    data: {
      nome: 'Aluno',
      descricao: 'Acesso à área do aluno'
    }
  });
  
  // Criar planos
  const planoMensal = await prisma.plano.create({
    data: {
      nome: 'Mensal',
      descricao: 'Plano mensal com acesso ilimitado',
      valor: 150.00,
      periodo: 1 // Meses
    }
  });
  
  const planoTrimestral = await prisma.plano.create({
    data: {
      nome: 'Trimestral',
      descricao: 'Plano trimestral com desconto',
      valor: 400.00,
      periodo: 3 // Meses
    }
  });
  
  // Criar usuários
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('123456', 8),
      role: 'admin',
      perfilId: adminPerfil.id
    }
  });
  
  const professorUser = await prisma.user.create({
    data: {
      name: 'Professor',
      email: 'professor@example.com',
      password: await bcrypt.hash('123456', 8),
      role: 'professor',
      perfilId: professorPerfil.id
    }
  });
  
  const alunoUser1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: await bcrypt.hash('123456', 8),
      role: 'aluno',
      perfilId: alunoPerfil.id
    }
  });
  
  const alunoUser2 = await prisma.user.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      password: await bcrypt.hash('123456', 8),
      role: 'aluno',
      perfilId: alunoPerfil.id
    }
  });
  
  // Criar requisitos de graduação
  const requisitoFaixaBrancaParaAzul = await prisma.requisitoGraduacao.create({
    data: {
      faixaAtual: 'BRANCA',
      faixaProxima: 'AZUL',
      tempoMinimo: 12, // meses
      frequenciaMinima: 70, // %
      observacoes: 'Precisa conhecer as posições básicas e pelo menos 5 finalizações'
    }
  });
  
  const requisitoFaixaAzulParaRoxa = await prisma.requisitoGraduacao.create({
    data: {
      faixaAtual: 'AZUL',
      faixaProxima: 'ROXA',
      tempoMinimo: 24, // meses
      frequenciaMinima: 60, // %
      observacoes: 'Precisa conhecer técnicas avançadas de guarda e passagem'
    }
  });
  
  // Criar alunos
  const aluno1 = await prisma.aluno.create({
    data: {
      userId: alunoUser1.id,
      dataNascimento: new Date('1990-05-15'),
      telefone: '11999998888',
      endereco: 'Rua A, 123',
      planoId: planoMensal.id,
      dataInicio: new Date('2023-01-10'),
      status: 'ATIVO'
    }
  });
  
  const aluno2 = await prisma.aluno.create({
    data: {
      userId: alunoUser2.id,
      dataNascimento: new Date('1995-08-20'),
      telefone: '11888887777',
      endereco: 'Rua B, 456',
      planoId: planoTrimestral.id,
      dataInicio: new Date('2022-11-05'),
      status: 'ATIVO'
    }
  });
  
  // Criar graduações
  const graduacaoAluno1 = await prisma.graduacao.create({
    data: {
      alunoId: aluno1.id,
      faixa: 'BRANCA',
      grau: 4,
      dataGraduacao: new Date('2023-01-10')
    }
  });
  
  const graduacaoAluno2 = await prisma.graduacao.create({
    data: {
      alunoId: aluno2.id,
      faixa: 'AZUL',
      grau: 2,
      dataGraduacao: new Date('2023-06-15')
    }
  });
  
  // Criar histórico de graduação
  await prisma.historicoGraduacao.create({
    data: {
      alunoId: aluno2.id,
      faixaAnterior: 'BRANCA',
      grauAnterior: 4,
      faixaNova: 'AZUL',
      grauNovo: 0,
      dataGraduacao: new Date('2022-12-10'),
      observacoes: 'Promoção por desempenho excelente'
    }
  });
  
  await prisma.historicoGraduacao.create({
    data: {
      alunoId: aluno2.id,
      faixaAnterior: 'AZUL',
      grauAnterior: 0,
      faixaNova: 'AZUL',
      grauNovo: 2,
      dataGraduacao: new Date('2023-06-15'),
      observacoes: 'Graduação regular'
    }
  });
  
  // Criar aulas
  const aula1 = await prisma.aula.create({
    data: {
      titulo: 'Fundamentos',
      descricao: 'Aula de fundamentos e técnicas básicas',
      horarioInicio: '19:00',
      horarioFim: '20:30',
      diaSemana: 'SEGUNDA',
      professorId: professorUser.id
    }
  });
  
  const aula2 = await prisma.aula.create({
    data: {
      titulo: 'Técnicas avançadas',
      descricao: 'Aula de técnicas avançadas e sparring',
      horarioInicio: '19:00',
      horarioFim: '20:30',
      diaSemana: 'QUARTA',
      professorId: professorUser.id
    }
  });
  
  // Criar presenças
  const dataAula1 = new Date('2023-05-01'); // Uma segunda-feira
  await prisma.presenca.create({
    data: {
      alunoId: aluno1.id,
      data: dataAula1,
      aulaId: aula1.id,
      presente: true
    }
  });
  
  const dataAula2 = new Date('2023-05-03'); // Uma quarta-feira
  await prisma.presenca.create({
    data: {
      alunoId: aluno1.id,
      data: dataAula2,
      aulaId: aula2.id,
      presente: true
    }
  });
  
  await prisma.presenca.create({
    data: {
      alunoId: aluno2.id,
      data: dataAula1,
      aulaId: aula1.id,
      presente: true
    }
  });
  
  // Criar mensalidades
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno1.id,
      valor: planoMensal.valor,
      dataVencimento: new Date('2023-05-10'),
      dataPagamento: new Date('2023-05-08'),
      status: 'PAGO',
      formaPagamento: 'PIX'
    }
  });
  
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno1.id,
      valor: planoMensal.valor,
      dataVencimento: new Date('2023-06-10'),
      status: 'PENDENTE'
    }
  });
  
  await prisma.mensalidade.create({
    data: {
      alunoId: aluno2.id,
      valor: planoTrimestral.valor,
      dataVencimento: new Date('2023-08-05'),
      status: 'PENDENTE'
    }
  });

  console.log('Test database seeded successfully');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
