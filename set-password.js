import { prisma } from './database.js';
import bcrypt from 'bcryptjs';

// Função para redefinir a senha de um usuário específico
async function setPassword() {
  try {
    // Parâmetros da linha de comando: email e senha
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('\nUso: node set-password.js <email> <nova_senha>');
      console.log('Exemplo: node set-password.js admin@example.com senha123\n');
      return;
    }
    
    const userEmail = args[0];
    const newPassword = args[1];
    
    // Validar a senha
    if (newPassword.length < 6) {
      console.error('\nErro: A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    console.log(`\nDefinindo nova senha para o usuário: ${userEmail}`);
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!user) {
      console.error(`\nErro: Usuário com email "${userEmail}" não encontrado!`);
      return;
    }
    
    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Atualizar a senha no banco de dados
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    });
    
    console.log(`\n✅ Senha definida com sucesso para o usuário: ${userEmail}`);
    console.log('\nDetalhes do usuário:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.name || 'N/A'}`);
    console.log(`Email: ${user.email}`);
    console.log(`\nCredenciais para login:`);
    console.log(`Email: ${userEmail}`);
    console.log(`Senha: ${newPassword}`);
    
  } catch (error) {
    console.error('\n❌ Erro ao definir a senha:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Mostrar todos os usuários disponíveis
async function listAllUsers() {
  try {
    console.log('\n======= USUÁRIOS DISPONÍVEIS =======\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado no banco de dados.');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name || 'N/A'}`);
        console.log(`Email: ${user.email}`);
        console.log('------------------------');
      });
      console.log(`Total: ${users.length} usuários encontrados.`);
    }
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script com base nos argumentos
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--list') {
  listAllUsers();
} else {
  setPassword();
}
