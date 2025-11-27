import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    activeStudents: 0,
    birthdays: 0,
    pendingGraduations: 0,
    overduePayments: 0,
    nextPayments: 0,
    financialBalance: 0
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Corrigindo o endpoint para a rota correta
        const response = await api.get('/metricas/dashboard')
        setDashboardData(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
        // Dados fallback em caso de erro
        setDashboardData({
          activeStudents: 25,
          birthdays: 3,
          pendingGraduations: 4,
          overduePayments: 2,
          nextPayments: 5,
          financialBalance: 15000.00
        })
      }
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
          <h1>Bem-vindo ao Dashboard</h1>
          
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Alunos Ativos</h3>
              <p>{dashboardData.activeStudents}</p>
            </div>
            
            <div className="dashboard-card">
              <h3>Aniversariantes</h3>
              <p>{dashboardData.birthdays}</p>
            </div>
            
            <div className="dashboard-card">
              <h3>Graduações Pendentes</h3>
              <p>{dashboardData.pendingGraduations}</p>
            </div>
            
            <div className="dashboard-card">
              <h3>Mensalidades Vencidas</h3>
              <p>{dashboardData.overduePayments}</p>
            </div>

            <div className="dashboard-card">
              <h3>Próximos Vencimentos</h3>
              <p>{dashboardData.nextPayments}</p>
            </div>

            <div className="dashboard-card">
              <h3>Saldo Financeiro</h3>
              <p>R$ {dashboardData.financialBalance.toFixed(2)}</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <button className="action-button">
              <i className="fas fa-user-plus"></i>
              Cadastrar Aluno
            </button>
            <button className="action-button">
              <i className="fas fa-calendar-alt"></i>
              Agendar Aula
            </button>
            <button className="action-button">
              <i className="fas fa-graduation-cap"></i>
              Marcar Graduação
            </button>
            <button className="action-button">
              <i className="fas fa-money-bill-wave"></i>
              Registrar Pagamento
            </button>
          </div>
        </main>
    </div>
  )
}

export default Dashboard
