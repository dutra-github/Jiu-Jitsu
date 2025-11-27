import { prisma } from '../database.js';

const ArteMarcialController = {
  async criar(req, res) {
    try {
      const arte = await prisma.arteMarcial.create({ data: req.body });
      return res.status(201).json(arte);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async listar(req, res) {
    try {
      const artes = await prisma.arteMarcial.findMany({ orderBy: { nome: 'asc' } });
      return res.json(artes);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async atualizar(req, res) {
    try {
      const arte = await prisma.arteMarcial.update({ where: { id: parseInt(req.params.id) }, data: req.body });
      return res.json(arte);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async deletar(req, res) {
    try {
      await prisma.arteMarcial.delete({ where: { id: parseInt(req.params.id) } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

export default ArteMarcialController;
