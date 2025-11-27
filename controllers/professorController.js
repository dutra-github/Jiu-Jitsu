import { prisma } from '../database.js';

const ProfessorController = {
  async criar(req, res) {
    try {
      const professor = await prisma.professor.create({
        data: req.body
      });
      return res.status(201).json(professor);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const professores = await prisma.professor.findMany({
        include: {
          _count: {
            select: { aulas: true }
          }
        },
        orderBy: { nome: 'asc' }
      });
      return res.json(professores);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async obter(req, res) {
    try {
      const id = parseInt(req.params.id);
      const professor = await prisma.professor.findUnique({
        where: { id },
        include: {
          aulas: true
        }
      });
      
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      return res.json(professor);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const professor = await prisma.professor.update({
        where: { id },
        data: req.body
      });
      return res.json(professor);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.professor.delete({
        where: { id }
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export default ProfessorController;
