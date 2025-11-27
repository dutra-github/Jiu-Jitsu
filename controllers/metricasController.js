import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  // Obter métricas gerais para o dashboard
  getDashboardMetricas: async (req, res) => {
    try {
      // Buscar dados reais do banco de dados
      
      // Contar alunos ativos
      const alunosAtivos = await prisma.aluno.count({
        where: { ativo: true }
      });

      // Contar aniversariantes do mês atual
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const alunos = await prisma.aluno.findMany({
        where: { 
          ativo: true,
          dataNascimento: { not: null }
        }
      });
      const aniversariantes = alunos.filter(aluno => {
        if (!aluno.dataNascimento) return false;
        const mesAniversario = new Date(aluno.dataNascimento).getMonth() + 1;
        return mesAniversario === mesAtual;
      }).length;

      // Buscar alunos aptos para graduação
      const alunosAptosData = await prisma.aluno.findMany({
        where: { ativo: true }
      });
      
      let graduacoesPendentes = 0;
      for (const aluno of alunosAptosData) {
        const requisito = await prisma.requisitoGraduacao.findFirst({
          where: {
            faixa: aluno.faixa || '',
            grau: aluno.grau || 0
          }
        });
        
        if (requisito && aluno.aulasDesdeUltGrad >= requisito.aulasNecessarias) {
          graduacoesPendentes++;
        }
      }

      // Contar mensalidades vencidas
      const mensalidadesVencidas = await prisma.mensalidade.count({
        where: {
          status: 'atrasado',
          dataPagamento: null
        }
      });

      // Contar mensalidades com vencimento nos próximos 7 dias
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 7);
      const proximosVencimentos = await prisma.mensalidade.count({
        where: {
          status: 'pendente',
          dataVencimento: {
            gte: hoje,
            lte: dataLimite
          }
        }
      });

      // Calcular saldo financeiro (mensalidades pagas no mês atual)
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      const mensalidadesPagas = await prisma.mensalidade.findMany({
        where: {
          status: 'pago',
          dataPagamento: {
            gte: inicioMes,
            lte: fimMes
          }
        }
      });
      
      const saldoFinanceiro = mensalidadesPagas.reduce((total, m) => total + m.valor, 0);

      // Retorna os dados reais
      res.json({
        activeStudents: alunosAtivos,
        birthdays: aniversariantes,
        pendingGraduations: graduacoesPendentes,
        overduePayments: mensalidadesVencidas,
        nextPayments: proximosVencimentos,
        financialBalance: saldoFinanceiro
      });
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      res.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
    }
  },

  // Obter métricas detalhadas de um aluno específico
  getAlunoMetricas: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar se o aluno existe
      const aluno = await prisma.aluno.findUnique({
        where: { id: parseInt(id) },
        include: {
          presencas: {
            orderBy: { data: 'desc' },
            take: 180 // últimos 6 meses aproximadamente
          },
          graduacoes: {
            orderBy: { dataGraduacao: 'asc' }
          }
        }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      // Calcular frequência dos últimos 6 meses
      const hoje = new Date();
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const frequencyData = [];
      
      for (let i = 5; i >= 0; i--) {
        const mesData = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
        
        const presencasMes = aluno.presencas.filter(p => {
          const dataPresenca = new Date(p.data);
          return dataPresenca >= mesData && dataPresenca < proximoMes && p.presente;
        }).length;
        
        // Assumindo ~20 aulas por mês, calcular porcentagem
        const attendance = Math.min(100, Math.round((presencasMes / 20) * 100));
        
        frequencyData.push({
          month: meses[mesData.getMonth()],
          attendance
        });
      }
      
      // Progresso de graduação baseado no histórico
      const graduationProgress = aluno.graduacoes.map(grad => ({
        level: `${grad.faixaNova} - ${grad.grauNovo}º grau`,
        completed: true,
        date: new Date(grad.dataGraduacao).toLocaleDateString('pt-BR')
      }));
      
      // Adicionar próxima graduação se houver requisito
      const requisito = await prisma.requisitoGraduacao.findFirst({
        where: {
          faixa: aluno.faixa || '',
          grau: aluno.grau || 0
        }
      });
      
      if (requisito) {
        const progress = Math.min(100, Math.round((aluno.aulasDesdeUltGrad / requisito.aulasNecessarias) * 100));
        graduationProgress.push({
          level: `${requisito.proximaFaixa} - ${requisito.proximoGrau}º grau`,
          completed: false,
          progress
        });
      }
      
      // Calcular métricas de desempenho baseadas em dados reais
      const totalPresencas = aluno.presencas.filter(p => p.presente).length;
      const frequenciaGeral = Math.min(100, Math.round((totalPresencas / Math.max(1, aluno.presencas.length)) * 100));
      
      const performanceMetrics = {
        technicalSkills: requisito ? Math.min(100, Math.round((aluno.aulasDesdeUltGrad / requisito.aulasNecessarias) * 100)) : 0,
        discipline: frequenciaGeral,
        teamwork: 75, // Placeholder - pode ser implementado com avaliações
        overallProgress: Math.round((frequenciaGeral + (requisito ? Math.min(100, Math.round((aluno.aulasDesdeUltGrad / requisito.aulasNecessarias) * 100)) : 0)) / 2)
      };
      
      // Gerar recomendações baseadas em dados
      const recommendations = [];
      
      if (frequenciaGeral < 70) {
        recommendations.push('Aumentar frequência nas aulas para melhor progresso');
      }
      
      if (requisito && aluno.aulasDesdeUltGrad >= requisito.aulasNecessarias) {
        recommendations.push(`Aluno apto para graduação para ${requisito.proximaFaixa} ${requisito.proximoGrau}º grau`);
      }
      
      if (aluno.presencas.length > 0) {
        const ultimaPresenca = new Date(aluno.presencas[0].data);
        const diasDesdeUltima = Math.floor((hoje - ultimaPresenca) / (1000 * 60 * 60 * 24));
        if (diasDesdeUltima > 14) {
          recommendations.push(`Aluno ausente há ${diasDesdeUltima} dias - considerar contato`);
        }
      }
      
      if (recommendations.length === 0) {
        recommendations.push('Aluno com bom desempenho, continue assim!');
      }
      
      res.json({
        aluno: {
          nome: aluno.nome,
          faixa: aluno.faixa,
          grau: aluno.grau,
          aulasDesdeUltGrad: aluno.aulasDesdeUltGrad
        },
        frequencyData,
        graduationProgress,
        performanceMetrics,
        recommendations
      });
    } catch (error) {
      console.error('Erro ao buscar métricas do aluno:', error);
      res.status(500).json({ error: 'Erro ao buscar métricas do aluno' });
    }
  }
};
