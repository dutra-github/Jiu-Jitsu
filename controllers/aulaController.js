import { prisma } from '../database.js';

const AulaController = {
  async criar(req, res) {
    try {
      const data = { ...req.body };
      
      // Converter campos
      if (data.diaSemana !== undefined) {
        data.diaSemana = parseInt(data.diaSemana);
      }
      if (data.professorId) {
        data.professorId = parseInt(data.professorId);
      }
      if (data.vagas) {
        data.vagas = parseInt(data.vagas);
      }
      
      const aula = await prisma.aula.create({
        data,
        include: {
          professor: true,
          _count: {
            select: { inscricoes: true }
          }
        }
      });
      return res.status(201).json(aula);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const aulas = await prisma.aula.findMany({
        include: {
          professor: true,
          _count: {
            select: { inscricoes: true }
          }
        },
        orderBy: [
          { diaSemana: 'asc' },
          { horaInicio: 'asc' }
        ]
      });
      return res.json(aulas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async obter(req, res) {
    try {
      const id = parseInt(req.params.id);
      const aula = await prisma.aula.findUnique({
        where: { id },
        include: {
          professor: true,
          inscricoes: {
            include: {
              aluno: true
            }
          }
        }
      });
      
      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }
      return res.json(aula);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = { ...req.body };
      
      if (data.diaSemana !== undefined) {
        data.diaSemana = parseInt(data.diaSemana);
      }
      if (data.professorId) {
        data.professorId = parseInt(data.professorId);
      }
      if (data.vagas) {
        data.vagas = parseInt(data.vagas);
      }
      
      const aula = await prisma.aula.update({
        where: { id },
        data,
        include: {
          professor: true
        }
      });
      return res.json(aula);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.aula.delete({
        where: { id }
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async inscreverAluno(req, res) {
    try {
      const aulaId = parseInt(req.params.id);
      const { alunoId } = req.body;
      
      // Verificar vagas
      const aula = await prisma.aula.findUnique({
        where: { id: aulaId },
        include: {
          _count: {
            select: { inscricoes: true }
          }
        }
      });
      
      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }
      
      if (aula._count.inscricoes >= aula.vagas) {
        return res.status(400).json({ error: 'Aula lotada' });
      }
      
      const inscricao = await prisma.inscricaoAula.create({
        data: {
          alunoId: parseInt(alunoId),
          aulaId
        },
        include: {
          aluno: true,
          aula: true
        }
      });
      
      return res.status(201).json(inscricao);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Aluno já inscrito nesta aula' });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  async desinscreverAluno(req, res) {
    try {
      const aulaId = parseInt(req.params.id);
      const { alunoId } = req.body;
      
      await prisma.inscricaoAula.deleteMany({
        where: {
          alunoId: parseInt(alunoId),
          aulaId
        }
      });
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export default AulaController;
