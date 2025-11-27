import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  // Obter métricas gerais para o dashboard
  getDashboardMetricas: async (req, res) => {
    try {
      // Dados estáticos para evitar problemas com o Prisma
      // Em uma implementação real, esses dados viriam do banco
      
      // Simulação de dados
      const alunosAtivos = 25;
      const aniversariantes = 3;
      const graduacoesPendentes = 4;
      const mensalidadesVencidas = 2;
      const proximosVencimentos = 5;
      const saldoFinanceiro = 15000.00;

      // Retorna os dados simulados
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
        where: { id: parseInt(id) }
      });
      
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      // Em uma implementação real, buscaríamos dados reais do banco
      // Aqui estamos retornando dados simulados para demonstração
      
      // Dados de frequência dos últimos 6 meses
      const frequencyData = [
        { month: 'Jan', attendance: Math.floor(Math.random() * 30) + 70 },
        { month: 'Fev', attendance: Math.floor(Math.random() * 30) + 70 },
        { month: 'Mar', attendance: Math.floor(Math.random() * 30) + 70 },
        { month: 'Abr', attendance: Math.floor(Math.random() * 30) + 70 },
        { month: 'Mai', attendance: Math.floor(Math.random() * 30) + 70 },
        { month: 'Jun', attendance: Math.floor(Math.random() * 30) + 70 }
      ];
      
      // Progresso de graduação
      const graduationProgress = [
        { 
          level: 'Faixa Branca', 
          completed: true, 
          date: '10/01/2024' 
        },
        { 
          level: 'Faixa Azul', 
          completed: true, 
          date: '15/04/2024' 
        },
        { 
          level: 'Faixa Roxa', 
          completed: false, 
          progress: Math.floor(Math.random() * 70) + 30 
        }
      ];
      
      // Métricas de desempenho
      const performanceMetrics = {
        technicalSkills: Math.floor(Math.random() * 30) + 70,
        discipline: Math.floor(Math.random() * 20) + 80,
        teamwork: Math.floor(Math.random() * 25) + 75,
        overallProgress: Math.floor(Math.random() * 25) + 75
      };
      
      // Recomendações baseadas em IA
      const recommendations = [
        'Aumentar frequência nas aulas de terça e quinta',
        'Focar em aprimorar técnicas de defesa',
        'Participar do próximo campeonato regional'
      ];
      
      res.json({
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
