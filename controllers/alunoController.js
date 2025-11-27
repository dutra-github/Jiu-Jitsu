import { prisma } from '../database.js';

const AlunoController = {
  async criarAluno(req, res) {
    try {
      const aluno = await prisma.aluno.create({
        data: req.body
      });
      return res.status(201).json(aluno);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async listarAlunos(req, res) {
    try {
      const { ativo, faixa, grau } = req.query;
      const where = {};
      
      if (ativo) where.ativo = ativo === 'true';
      if (faixa) where.faixa = faixa;
      if (grau !== undefined) where.grau = parseInt(grau);

      const alunos = await prisma.aluno.findMany({ where });
      return res.json(alunos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async obterAluno(req, res) {
    try {
      const id = parseInt(req.params.id);
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      return res.json(aluno);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async atualizarAluno(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o aluno existe
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      const updatedAluno = await prisma.aluno.update({
        where: { id },
        data: req.body
      });
      
      return res.json(updatedAluno);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async removerAluno(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar se o aluno existe
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      await prisma.aluno.delete({
        where: { id }
      });
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async registrarAula(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { aulaId, data } = req.body;
      
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      // Registrar presença
      await prisma.presenca.create({
        data: {
          alunoId: id,
          aulaId,
          data: data ? new Date(data) : new Date(),
          presente: true
        }
      });
      
      // Atualizar contador de aulas desde a última graduação
      const alunoAtualizado = await prisma.aluno.update({
        where: { id },
        data: {
          aulasDesdeUltGrad: aluno.aulasDesdeUltGrad + 1
        }
      });
      
      return res.json(alunoAtualizado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async atualizarGraduacao(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { faixa, grau, professor, observacoes } = req.body;
      
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      // Criar registro no histórico de graduação
      await prisma.historicoGraduacao.create({
        data: {
          alunoId: id,
          faixaAnterior: aluno.faixa,
          grauAnterior: aluno.grau,
          faixaNova: faixa,
          grauNovo: grau,
          dataGraduacao: new Date(),
          quantidadeAulas: aluno.aulasDesdeUltGrad,
          professor,
          observacoes
        }
      });
      
      // Atualizar faixa e grau do aluno
      const alunoAtualizado = await prisma.aluno.update({
        where: { id },
        data: {
          faixa,
          grau,
          aulasDesdeUltGrad: 0
        }
      });
      
      return res.json(alunoAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async obterHistorico(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      const aluno = await prisma.aluno.findUnique({
        where: { id }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      const historico = await prisma.historicoGraduacao.findMany({
        where: { alunoId: id },
        orderBy: { dataGraduacao: 'desc' }
      });
      
      return res.json({
        aluno,
        historico
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  async alunosAptoParaGraduacao(req, res) {
    try {
      // Obter todos os alunos ativos
      const alunos = await prisma.aluno.findMany({
        where: { ativo: true }
      });
      
      const alunosAptos = [];
      
      for (const aluno of alunos) {
        // Obter requisitos para a faixa e grau atuais do aluno
        const requisito = await prisma.requisitoGraduacao.findFirst({
          where: {
            faixa: aluno.faixa,
            grau: aluno.grau
          }
        });
        
        if (requisito && aluno.aulasDesdeUltGrad >= requisito.aulasNecessarias) {
          alunosAptos.push({
            ...aluno,
            proximaFaixa: requisito.proximaFaixa,
            proximoGrau: requisito.proximoGrau,
            aulasNecessarias: requisito.aulasNecessarias
          });
        }
      }
      
      return res.json(alunosAptos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default AlunoController;
