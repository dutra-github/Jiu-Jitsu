// @ts-check
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Configura caminhos para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash('teste@login', 8);
    
    const user = await prisma.user.update({
      where: {
        email: 'admin@example.com'
      },
      data: {
        password: hashedPassword
      }
    });

    if (user) {
      console.log('Senha do admin atualizada com sucesso!');
    } else {
      console.log('Usuário admin não encontrado!');
    }
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
