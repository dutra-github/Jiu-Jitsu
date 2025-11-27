import { prisma } from '../database.js';

// O modelo Aluno já está definido no schema.prisma
// Esta é apenas uma interface para acessar o modelo Prisma
const Aluno = prisma.aluno;

export default Aluno;
