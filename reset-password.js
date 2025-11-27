import { prisma } from './database.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

// Configuração para leitura de entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para redefinir a senha de um usuário
async function resetPassword(userEmail, newPassword) {
  try {
    console.log(`\nTentando redefinir a senha para o usuário: ${userEmail}`);
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!user) {
      console.error(`\nUsuário com email "${userEmail}" não encontrado!`);
      return false;
    }
    
    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Atualizar a senha no banco de dados
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    });
    
    console.log(`\n✅ Senha redefinida com sucesso para o usuário: ${userEmail}`);
    console.log('\nDetalhes do usuário:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.name || 'N/A'}`);
    console.log(`Email: ${user.email}`);
    return true;
    
  } catch (error) {
    console.error('\n❌ Erro ao redefinir a senha:', error);
    return false;
  }
}

// Função para listar todos os usuários (ajuda o usuário a escolher)
async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: { id: 'asc' }
    });
    
    console.log('\n======= USUÁRIOS DISPONÍVEIS =======\n');
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado no banco de dados.');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name || 'N/A'}`);
        console.log(`Email: ${user.email}`);
        console.log('------------------------');
      });
    }
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

// Função principal que coordena o fluxo
async function main() {
  try {
    // Listar usuários para ajudar na escolha
    const users = await listUsers();
    
    if (users.length === 0) {
      console.log('Não há usuários para redefinir a senha.');
      await prisma.$disconnect();
      process.exit(0);
    }
    
    // Pedir ao usuário para escolher um email
    rl.question('\nDigite o email do usuário para redefinir a senha: ', (userEmail) => {
      // Verificar se o email existe na lista
      const userExists = users.some(user => user.email === userEmail);
      
      if (!userExists) {
        console.log(`\nATENÇÃO: O email "${userEmail}" não foi encontrado na lista.`);
        rl.question('Deseja continuar mesmo assim? (s/n): ', async (answer) => {
          if (answer.toLowerCase() !== 's') {
            console.log('Operação cancelada pelo usuário.');
            await prisma.$disconnect();
            rl.close();
            return;
          }
          
          askForNewPassword(userEmail);
        });
      } else {
        askForNewPassword(userEmail);
      }
    });
    
  } catch (error) {
    console.error('Erro no processo de redefinição de senha:', error);
    await prisma.$disconnect();
    rl.close();
  }
}

// Função auxiliar para pedir a nova senha
function askForNewPassword(userEmail) {
  rl.question('\nDigite a nova senha (mínimo 6 caracteres): ', async (newPassword) => {
    // Validar a senha
    if (!newPassword || newPassword.length < 6) {
      console.log('\nA senha deve ter pelo menos 6 caracteres. Tente novamente.');
      askForNewPassword(userEmail);
      return;
    }
    
    // Confirmar a senha
    rl.question('Confirme a nova senha: ', async (confirmPassword) => {
      if (newPassword !== confirmPassword) {
        console.log('\nAs senhas não correspondem. Tente novamente.');
        askForNewPassword(userEmail);
        return;
      }
      
      // Redefinir a senha
      const success = await resetPassword(userEmail, newPassword);
      
      if (success) {
        console.log(`\nVocê pode agora fazer login com:`);
        console.log(`Email: ${userEmail}`);
        console.log(`Senha: ${newPassword}`);
      }
      
      // Encerrar conexão e sair
      await prisma.$disconnect();
      rl.close();
    });
  });
}

// Iniciar o programa
console.log('=== FERRAMENTA DE REDEFINIÇÃO DE SENHA ===');
main();
