import { prisma } from './database.js';

// Função para listar todos os usuários
async function listUsers() {
  try {
    console.log('Buscando usuários cadastrados...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,  // Nome do usuário
        email: true, // Email do usuário
        role: true,  // Perfil/tipo do usuário
        password: false // Não exibir senhas
      }
    });
    
    console.log('\n======= USUÁRIOS CADASTRADOS =======\n');
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado no banco de dados.');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Perfil: ${user.role || 'aluno'}`);
        console.log('------------------------');
      });
      console.log(`Total: ${users.length} usuários encontrados.`);
    }
    
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função para listar usuários
listUsers();
