import { prisma } from '../database.js';

const TipoAulaController = {
  async criar(req, res) {
    try {
      const tipo = await prisma.tipoAula.create({ data: req.body });
      return res.status(201).json(tipo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async listar(req, res) {
    try {
      const tipos = await prisma.tipoAula.findMany({ orderBy: { nome: 'asc' } });
      return res.json(tipos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async atualizar(req, res) {
    try {
      const tipo = await prisma.tipoAula.update({ where: { id: parseInt(req.params.id) }, data: req.body });
      return res.json(tipo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async deletar(req, res) {
    try {
      await prisma.tipoAula.delete({ where: { id: parseInt(req.params.id) } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export default TipoAulaController;
