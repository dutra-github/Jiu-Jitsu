import React, { useState, useEffect } from 'react';
import './AIAgent.css';

const AIAgent = () => {
  const [metrics, setMetrics] = useState({
    alunosAtivos: 0,
    proximasGraduacoes: 0,
    mensalidadesAtrasadas: 0,
    alunosAptos: 0
  });
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulação de dados - substituir por chamada real à API
        const mockMetrics = {
          alunosAtivos: 42,
          proximasGraduacoes: 8,
          mensalidadesAtrasadas: 3,
          alunosAptos: 5
        };
        setMetrics(mockMetrics);
        
        // Análise básica
        let analysisText = '';
        if (mockMetrics.mensalidadesAtrasadas > 0) {
          analysisText += `⚠️ ${mockMetrics.mensalidadesAtrasadas} mensalidade(s) atrasada(s). `;
        }
        if (mockMetrics.alunosAptos > 0) {
          analysisText += `🎯 ${mockMetrics.alunosAptos} aluno(s) apto(s) para graduação. `;
        }
        setAnalysis(analysisText || '✅ Tudo em ordem!');
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ai-agent-container">
      <h2>Agente de IA - Análise de Desempenho</h2>
      
      {loading ? (
        <div className="loading">Carregando análise...</div>
      ) : (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Alunos Ativos</h3>
              <p>{metrics.alunosAtivos}</p>
            </div>
            
            <div className="metric-card">
              <h3>Próximas Graduações</h3>
              <p>{metrics.proximasGraduacoes}</p>
            </div>
            
            <div className="metric-card">
              <h3>Mensalidades Atrasadas</h3>
              <p>{metrics.mensalidadesAtrasadas}</p>
            </div>
            
            <div className="metric-card">
              <h3>Alunos Aptos</h3>
              <p>{metrics.alunosAptos}</p>
            </div>
          </div>

          <div className="analysis-section">
            <h3>Análise do Agente</h3>
            <p>{analysis}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAgent;
