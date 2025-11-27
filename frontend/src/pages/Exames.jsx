import React, { useState } from 'react'
import api from '../services/api'

function Exames() {
  const [mesAtual, setMesAtual] = useState(new Date())
  const [exameModal, setExameModal] = useState(null)
  
  const [exames] = useState([
    { 
      id: 1, 
      titulo: 'Exame Faixa Azul', 
      data: '2025-12-15',
      horario: '10:00',
      candidatos: 8,
      cor: '#3b82f6',
      requisitos: 'Mínimo 6 meses, 100 aulas'
    },
    { 
      id: 2, 
      titulo: 'Exame Faixa Roxa', 
      data: '2025-12-15',
      horario: '14:00',
      candidatos: 5,
      cor: '#8b5cf6',
      requisitos: 'Mínimo 2 anos na azul'
    },
    { 
      id: 3, 
      titulo: 'Exame Faixa Marrom', 
      data: '2026-01-20',
      horario: '15:00',
      candidatos: 3,
      cor: '#92400e',
      requisitos: 'Mínimo 3 anos na roxa'
    }
  ])

  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth()
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const diasAnteriores = primeiroDia.getDay()
    
    const dias = []
    
    // Dias do mês anterior
    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const dia = new Date(ano, mes, -i)
      dias.push({ data: dia, mesAtual: false })
    }
    
    // Dias do mês atual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(ano, mes, i)
      dias.push({ data: dia, mesAtual: true })
    }
    
    // Completar com dias do próximo mês
    const diasRestantes = 42 - dias.length
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(ano, mes + 1, i)
      dias.push({ data: dia, mesAtual: false })
    }
    
    return dias
  }

  const getExamesNoDia = (data) => {
    const dataStr = data.toISOString().split('T')[0]
    return exames.filter(exame => exame.data === dataStr)
  }

  const mudarMes = (direcao) => {
    const novoMes = new Date(mesAtual)
    novoMes.setMonth(novoMes.getMonth() + direcao)
    setMesAtual(novoMes)
  }

  const inscreverExame = async (exameId) => {
    try {
      await api.post(`/exames/${exameId}/inscrever`)
      alert('Inscrição realizada com sucesso!')
      setExameModal(null)
    } catch (error) {
      alert('Erro ao inscrever: ' + (error.response?.data?.error || error.message))
    }
  }

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Calendário de Exames</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Visualize e gerencie os exames de graduação</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {/* Header do Calendário */}
        <div style={{ 
          padding: '1.5rem', 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => mudarMes(-1)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
          </h2>
          
          <button
            onClick={() => mudarMes(1)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Dias da Semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
          {diasSemana.map(dia => (
            <div key={dia} style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: '0.875rem' }}>
              {dia}
            </div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {getDiasDoMes().map((dia, index) => {
            const examesNoDia = getExamesNoDia(dia.data)
            const hoje = new Date().toDateString() === dia.data.toDateString()
            
            return (
              <div
                key={index}
                style={{
                  minHeight: '100px',
                  padding: '0.5rem',
                  borderRight: (index + 1) % 7 !== 0 ? '1px solid #e2e8f0' : 'none',
                  borderBottom: index < 35 ? '1px solid #e2e8f0' : 'none',
                  background: !dia.mesAtual ? '#fafafa' : hoje ? '#eff6ff' : 'white',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: hoje ? '700' : '500',
                  color: !dia.mesAtual ? '#cbd5e1' : hoje ? '#3b82f6' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  {dia.data.getDate()}
                </div>
                
                {examesNoDia.map(exame => (
                  <div
                    key={exame.id}
                    onClick={() => setExameModal(exame)}
                    style={{
                      background: exame.cor,
                      color: 'white',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div>{exame.horario}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>{exame.titulo}</div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de Detalhes do Exame */}
      {exameModal && (
        <div 
          onClick={() => setExameModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                {exameModal.titulo}
              </h2>
              <button 
                onClick={() => setExameModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-calendar" style={{ color: exameModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{new Date(exameModal.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-clock" style={{ color: exameModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{exameModal.horario}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-users" style={{ color: exameModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{exameModal.candidatos} candidatos inscritos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-info-circle" style={{ color: exameModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{exameModal.requisitos}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setExameModal(null)}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
              <button
                onClick={() => inscreverExame(exameModal.id)}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: exameModal.cor,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Exames
