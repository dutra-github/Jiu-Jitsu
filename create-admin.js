import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Criando usuário administrador...');

    // Verificar se já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@jiujitsu.com' }
    });

    if (existingAdmin) {
      console.log('Admin já existe! Atualizando role...');
      const updated = await prisma.user.update({
        where: { email: 'admin@jiujitsu.com' },
        data: { role: 'admin' }
      });
      console.log('✅ Admin atualizado:', updated.email, '- Role:', updated.role);
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 8);
      
      const admin = await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@jiujitsu.com',
          password: hashedPassword,
          role: 'admin'
        }
      });

      console.log('✅ Admin criado com sucesso!');
      console.log('Email:', admin.email);
      console.log('Senha: admin123');
      console.log('Role:', admin.role);
    }

    // Atualizar o admin@example.com também
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: { role: 'admin' }
      });
      console.log('✅ admin@example.com atualizado para role admin');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
