import { prisma } from '../database.js';

const AlunoController = {
  async criarAluno(req, res) {
    try {
      const data = { ...req.body };
      
      // Converter datas para DateTime
      if (data.dataNascimento) {
        data.dataNascimento = new Date(data.dataNascimento);
      }
      if (data.dataInicio) {
        data.dataInicio = new Date(data.dataInicio);
      }
      
      // Converter grau para número
      if (data.grau !== undefined) {
        data.grau = parseInt(data.grau);
      }
      
      // Gerar matrícula automática: DDMMYYYYNN (ex: 0309202501)
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano = hoje.getFullYear();
      const prefixo = `${dia}${mes}${ano}`;
      
      // Buscar último aluno do dia para incrementar
      const ultimoAluno = await prisma.aluno.findFirst({
        where: {
          matricula: {
            startsWith: prefixo
          }
        },
        orderBy: {
          matricula: 'desc'
        }
      });
      
      let sequencial = 1;
      if (ultimoAluno) {
        const ultimoSequencial = parseInt(ultimoAluno.matricula.slice(-2));
        sequencial = ultimoSequencial + 1;
      }
      
      data.matricula = `${prefixo}${String(sequencial).padStart(2, '0')}`;
      
      const aluno = await prisma.aluno.create({
        data
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
  },

  // Listar alunos aptos para graduação
  async listarAptosGraduacao(req, res) {
    try {
      const alunos = await prisma.aluno.findMany({
        include: {
          _count: {
            select: { presencas: true }
          }
        }
      });

      // Filtrar alunos aptos baseado em critérios
      const alunosAptos = alunos.filter(aluno => {
        const totalAulas = aluno._count.presencas;
        const dataMatricula = new Date(aluno.dataMatricula);
        const hoje = new Date();
        const mesesNaFaixa = Math.floor((hoje - dataMatricula) / (1000 * 60 * 60 * 24 * 30));

        // Critérios: mínimo 50 aulas OU 6 meses na faixa
        return totalAulas >= 50 || mesesNaFaixa >= 6;
      });

      // Adicionar informações extras
      const alunosComInfo = alunosAptos.map(aluno => {
        const dataMatricula = new Date(aluno.dataMatricula);
        const hoje = new Date();
        const mesesNaFaixa = Math.floor((hoje - dataMatricula) / (1000 * 60 * 60 * 24 * 30));

        return {
          ...aluno,
          totalAulas: aluno._count.presencas,
          mesesNaFaixa
        };
      });

      return res.json(alunosComInfo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Graduar aluno
  async graduarAluno(req, res) {
    try {
      const { id } = req.params;
      const aluno = await prisma.aluno.findUnique({ where: { id: parseInt(id) } });

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      // Lógica de graduação
      let novaFaixa = aluno.faixa;
      let novoGrau = aluno.grau + 1;

      // Se atingiu 4º grau, passa para próxima faixa
      if (novoGrau > 4) {
        novoGrau = 0;
        const faixas = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
        const indexAtual = faixas.indexOf(aluno.faixa);
        if (indexAtual < faixas.length - 1) {
          novaFaixa = faixas[indexAtual + 1];
        }
      }

      // Atualizar aluno
      const alunoAtualizado = await prisma.aluno.update({
        where: { id: parseInt(id) },
        data: {
          faixa: novaFaixa,
          grau: novoGrau
        }
      });

      // Registrar no histórico
      await prisma.historicoGraduacao.create({
        data: {
          alunoId: parseInt(id),
          faixaAnterior: aluno.faixa,
          grauAnterior: aluno.grau,
          faixaNova: novaFaixa,
          grauNovo: novoGrau,
          dataGraduacao: new Date()
        }
      });

      return res.json(alunoAtualizado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default AlunoController;
