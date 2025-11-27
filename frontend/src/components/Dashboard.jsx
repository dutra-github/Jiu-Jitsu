import React, { useState, useEffect } from 'react'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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

  // Dados para gráfico de evolução de alunos
  const evolutionData = [
    { mes: 'Jan', alunos: 15 },
    { mes: 'Fev', alunos: 18 },
    { mes: 'Mar', alunos: 22 },
    { mes: 'Abr', alunos: 20 },
    { mes: 'Mai', alunos: 25 },
    { mes: 'Jun', alunos: 28 }
  ]

  // Dados para gráfico de pizza - Distribuição por faixa
  const beltDistribution = [
    { name: 'Branca', value: 12, color: '#f8f9fa' },
    { name: 'Azul', value: 8, color: '#3b82f6' },
    { name: 'Roxa', value: 4, color: '#8b5cf6' },
    { name: 'Marrom', value: 2, color: '#92400e' },
    { name: 'Preta', value: 1, color: '#1e293b' }
  ]

  // Dados para gráfico de barras - Frequência semanal
  const weeklyAttendance = [
    { dia: 'Seg', presencas: 18 },
    { dia: 'Ter', presencas: 22 },
    { dia: 'Qua', presencas: 20 },
    { dia: 'Qui', presencas: 25 },
    { dia: 'Sex', presencas: 19 },
    { dia: 'Sáb', presencas: 15 }
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/metricas/dashboard')
        setDashboardData(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
      }
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div className="dashboard-professional">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Executivo</h1>
          <p className="subtitle">Visão geral e análise de desempenho</p>
        </div>
        <div className="header-actions">
          <button className="btn-export">
            <i className="fas fa-download"></i> Exportar
          </button>
          <button className="btn-refresh" onClick={() => window.location.reload()}>
            <i className="fas fa-sync-alt"></i> Atualizar
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-label">Alunos Ativos</span>
            <i className="fas fa-users"></i>
          </div>
          <div className="kpi-value">{dashboardData.activeStudents}</div>
          <div className="kpi-footer">
            <span className="trend positive">
              <i className="fas fa-arrow-up"></i> +12% vs mês anterior
            </span>
          </div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-header">
            <span className="kpi-label">Taxa de Presença</span>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="kpi-value">87%</div>
          <div className="kpi-footer">
            <span className="trend positive">
              <i className="fas fa-arrow-up"></i> +5% vs mês anterior
            </span>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-header">
            <span className="kpi-label">Graduações Pendentes</span>
            <i className="fas fa-medal"></i>
          </div>
          <div className="kpi-value">{dashboardData.pendingGraduations}</div>
          <div className="kpi-footer">
            <span className="trend neutral">
              <i className="fas fa-minus"></i> Sem alteração
            </span>
          </div>
        </div>

        <div className="kpi-card financial">
          <div className="kpi-header">
            <span className="kpi-label">Receita Mensal</span>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="kpi-value">R$ {dashboardData.financialBalance.toFixed(2)}</div>
          <div className="kpi-footer">
            <span className="trend positive">
              <i className="fas fa-arrow-up"></i> +8% vs mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Gráfico de Evolução */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Evolução de Alunos</h3>
            <span className="chart-period">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="alunos" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição por Faixa */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribuição por Faixa</h3>
            <span className="chart-period">Total de alunos</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={beltDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {beltDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {beltDistribution.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras - Frequência Semanal */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Frequência Semanal</h3>
            <span className="chart-period">Última semana</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="presencas" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <i className="fas fa-birthday-cake"></i>
          <div>
            <span className="stat-value">{dashboardData.birthdays}</span>
            <span className="stat-label">Aniversariantes</span>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-exclamation-circle"></i>
          <div>
            <span className="stat-value">{dashboardData.overduePayments}</span>
            <span className="stat-label">Mensalidades Vencidas</span>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-calendar-alt"></i>
          <div>
            <span className="stat-value">{dashboardData.nextPayments}</span>
            <span className="stat-label">Próximos Vencimentos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
