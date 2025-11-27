import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import api from '../services/api'

function GradeAulas() {
  const { user } = useContext(AuthContext)
  const [visualizacao, setVisualizacao] = useState('semana') // 'semana', 'mes', 'ano'
  const [semanaAtual, setSemanaAtual] = useState(0)
  const [mesAtual, setMesAtual] = useState(new Date())
  const [criarAulaModal, setCriarAulaModal] = useState(null)
  
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const horarios = ['06:00', '07:00', '08:00', '09:00', '10:00', '18:00', '19:00', '20:00', '21:00']

  const getDataSemana = () => {
    const hoje = new Date()
    const primeiroDia = new Date(hoje)
    primeiroDia.setDate(hoje.getDate() - hoje.getDay() + 1 + (semanaAtual * 7)) // Segunda-feira
    
    const ultimoDia = new Date(primeiroDia)
    ultimoDia.setDate(primeiroDia.getDate() + 5) // Sábado
    
    return {
      inicio: primeiroDia.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      fim: ultimoDia.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  }

  const getDiasDaSemana = () => {
    const hoje = new Date()
    const primeiroDia = new Date(hoje)
    primeiroDia.setDate(hoje.getDate() - hoje.getDay() + 1 + (semanaAtual * 7))
    
    const dias = []
    for (let i = 0; i < 6; i++) {
      const dia = new Date(primeiroDia)
      dia.setDate(primeiroDia.getDate() + i)
      dias.push(dia)
    }
    return dias
  }

  const mudarSemana = (direcao) => {
    setSemanaAtual(semanaAtual + direcao)
  }

  const mudarMes = (direcao) => {
    const novoMes = new Date(mesAtual)
    novoMes.setMonth(novoMes.getMonth() + direcao)
    setMesAtual(novoMes)
  }

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

  const getAulasNoDia = (data) => {
    const diaSemana = data.getDay() === 0 ? 6 : data.getDay() - 1 // Ajustar domingo
    return aulas.filter(aula => aula.dia === diaSemana)
  }

  const isHoje = (data) => {
    const hoje = new Date()
    return data.toDateString() === hoje.toDateString()
  }

  const abrirCriarAula = (dia, hora) => {
    if (!isAdmin) return
    setCriarAulaModal({ dia, hora })
  }

  const criarNovaAula = async () => {
    try {
      await api.post('/aulas', {
        ...formData,
        dia: criarAulaModal.dia,
        horaInicio: criarAulaModal.hora
      })
      alert('Aula criada com sucesso!')
      setCriarAulaModal(null)
      // Recarregar aulas
    } catch (error) {
      alert('Erro ao criar aula: ' + (error.response?.data?.error || error.message))
    }
  }

  const [aulas, setAulas] = useState([])
  const [professores, setProfessores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAulas()
    fetchProfessores()
  }, [])

  const fetchAulas = async () => {
    try {
      const response = await api.get('/aulas')
      setAulas(response.data)
    } catch (error) {
      console.error('Erro ao buscar aulas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfessores = async () => {
    try {
      const response = await api.get('/professores')
      setProfessores(response.data.filter(p => p.ativo))
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
    }
  }

  const getTipoColor = (tipo) => {
    const colors = {
      'Gi': '#3b82f6',
      'No-Gi': '#8b5cf6',
      'Sparring': '#ef4444',
      'Open Mat': '#10b981'
    }
    return colors[tipo] || '#64748b'
  }

  const [aulaModal, setAulaModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [formData, setFormData] = useState({})

  const inscreverAula = async (aulaId) => {
    try {
      await api.post(`/aulas/${aulaId}/inscrever`, { alunoId: user.id })
      alert('Inscrição realizada com sucesso!')
      setAulaModal(null)
      fetchAulas()
    } catch (error) {
      alert('Erro ao inscrever: ' + (error.response?.data?.error || error.message))
    }
  }

  const editarAula = (aula) => {
    setFormData({
      id: aula.id,
      tipo: aula.tipo,
      nivel: aula.nivel,
      professor: aula.professor,
      horaInicio: aula.horaInicio,
      horaFim: aula.horaFim,
      vagas: aula.vagas,
      dia: aula.dia
    })
    setEditModal(true)
    setAulaModal(null)
  }

  const salvarEdicao = async () => {
    try {
      await api.put(`/aulas/${formData.id}`, formData)
      alert('Aula atualizada com sucesso!')
      setEditModal(null)
      // Aqui você deveria recarregar a lista de aulas
    } catch (error) {
      alert('Erro ao atualizar: ' + (error.response?.data?.error || error.message))
    }
  }

  const excluirAula = async (aulaId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aula?')) return
    
    try {
      await api.delete(`/aulas/${aulaId}`)
      alert('Aula excluída com sucesso!')
      setAulaModal(null)
      // Aqui você deveria recarregar a lista de aulas
    } catch (error) {
      alert('Erro ao excluir: ' + (error.response?.data?.error || error.message))
    }
  }

  const isAdmin = user?.role === 'admin'

  const getAulasPorDiaHora = (dia, hora) => {
    return aulas.filter(aula => aula.diaSemana === dia && aula.horaInicio === hora)
  }

  const dataSemana = getDataSemana()
  const diasDaSemana = getDiasDaSemana()

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Grade de Aulas</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Calendário de aulas</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Botões de Visualização */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '0.25rem' }}>
            <button
              onClick={() => setVisualizacao('semana')}
              style={{
                padding: '0.5rem 1rem',
                background: visualizacao === 'semana' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                color: visualizacao === 'semana' ? '#1e293b' : '#64748b',
                cursor: 'pointer',
                boxShadow: visualizacao === 'semana' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Semana
            </button>
            <button
              onClick={() => setVisualizacao('mes')}
              style={{
                padding: '0.5rem 1rem',
                background: visualizacao === 'mes' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                color: visualizacao === 'mes' ? '#1e293b' : '#64748b',
                cursor: 'pointer',
                boxShadow: visualizacao === 'mes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Mês
            </button>
          </div>
          {isAdmin && (
            <button
              onClick={() => setCriarAulaModal({ dia: 0, hora: '06:00' })}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-plus"></i> Criar Aula
            </button>
          )}
        </div>
      </div>

      {/* Navegação */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <button
          onClick={() => visualizacao === 'semana' ? mudarSemana(-1) : mudarMes(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div style={{ textAlign: 'center' }}>
          {visualizacao === 'semana' ? (
            <>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                {dataSemana.inicio} - {dataSemana.fim}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {semanaAtual === 0 ? 'Semana Atual' : semanaAtual > 0 ? `${semanaAtual} semana${semanaAtual > 1 ? 's' : ''} à frente` : `${Math.abs(semanaAtual)} semana${Math.abs(semanaAtual) > 1 ? 's' : ''} atrás`}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
            </div>
          )}
        </div>
        
        <button
          onClick={() => visualizacao === 'semana' ? mudarSemana(1) : mudarMes(1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Visualização Semanal */}
      {visualizacao === 'semana' && (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', width: '80px', borderRight: '1px solid #e2e8f0' }}>
                HORÁRIO
              </th>
              {diasDaSemana.map((data, index) => {
                const hoje = isHoje(data)
                return (
                  <th key={index} style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    borderRight: index < diasDaSemana.length - 1 ? '1px solid #e2e8f0' : 'none',
                    background: hoje ? '#eff6ff' : '#f8fafc'
                  }}>
                    <div style={{ 
                      color: hoje ? '#3b82f6' : '#1e293b', 
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>
                      {diasSemana[index]}
                    </div>
                    <div style={{ 
                      color: hoje ? '#3b82f6' : '#64748b',
                      fontSize: '1.25rem',
                      fontWeight: '700'
                    }}>
                      {data.getDate()}
                    </div>
                    <div style={{ 
                      color: hoje ? '#3b82f6' : '#94a3b8',
                      fontSize: '0.75rem'
                    }}>
                      {data.toLocaleDateString('pt-BR', { month: 'short' })}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {horarios.map((hora, horaIndex) => (
              <tr key={hora} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 1rem', color: '#64748b', fontSize: '0.875rem', fontWeight: '500', borderRight: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                  {hora}
                </td>
                {diasSemana.map((dia, diaIndex) => {
                  const aulasNaHora = getAulasPorDiaHora(diaIndex, hora)
                  return (
                    <td 
                      key={diaIndex} 
                      onClick={() => aulasNaHora.length === 0 && abrirCriarAula(diaIndex, hora)}
                      style={{ 
                        padding: '0.5rem', 
                        borderRight: diaIndex < diasSemana.length - 1 ? '1px solid #e2e8f0' : 'none',
                        verticalAlign: 'top',
                        minHeight: '80px',
                        cursor: isAdmin && aulasNaHora.length === 0 ? 'pointer' : 'default',
                        background: isAdmin && aulasNaHora.length === 0 ? 'transparent' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (isAdmin && aulasNaHora.length === 0) {
                          e.currentTarget.style.background = '#f8fafc'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {aulasNaHora.map(aula => (
                        <div 
                          key={aula.id}
                          onClick={() => setAulaModal(aula)}
                          style={{
                            background: getTipoColor(aula.tipo),
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            marginBottom: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)'
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{aula.horaInicio} - {aula.horaFim}</div>
                          <div>{aula.tipo}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{aula.nivel}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{aula.professor?.nome || 'Sem professor'}</div>
                          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <i className="fas fa-users" style={{ fontSize: '0.7rem' }}></i>
                            {aula._count?.inscricoes || 0}/{aula.vagas}
                          </div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Visualização Mensal */}
      {visualizacao === 'mes' && (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Dias da Semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: '0.875rem' }}>
                {dia}
              </div>
            ))}
          </div>

          {/* Grid de Dias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {getDiasDoMes().map((dia, index) => {
              const aulasNoDia = getAulasNoDia(dia.data)
              const hoje = isHoje(dia.data)
              
              return (
                <div
                  key={index}
                  style={{
                    minHeight: '120px',
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
                  
                  {aulasNoDia.slice(0, 3).map(aula => (
                    <div
                      key={aula.id}
                      onClick={() => setAulaModal(aula)}
                      style={{
                        background: aula.cor,
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      {aula.horaInicio} {aula.tipo}
                    </div>
                  ))}
                  {aulasNoDia.length > 3 && (
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                      +{aulasNoDia.length - 3} mais
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Aula */}
      {aulaModal && (
        <div 
          onClick={() => setAulaModal(null)}
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
                {aulaModal.tipo} - {aulaModal.nivel}
              </h2>
              <button 
                onClick={() => setAulaModal(null)}
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
                <i className="fas fa-clock" style={{ color: aulaModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{aulaModal.horaInicio} - {aulaModal.horaFim}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-user-tie" style={{ color: aulaModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{aulaModal.professor}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-users" style={{ color: aulaModal.cor, width: '20px' }}></i>
                <span style={{ color: '#475569' }}>{aulaModal.ocupadas} / {aulaModal.vagas} vagas ocupadas</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e2e8f0', 
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '0.5rem'
              }}>
                <div style={{ 
                  width: `${(aulaModal.ocupadas / aulaModal.vagas) * 100}%`, 
                  height: '100%', 
                  background: aulaModal.cor,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                <i className="fas fa-crown" style={{ color: '#d97706' }}></i>
                <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                  Modo Administrador
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isAdmin && (
                <>
                  <button
                    onClick={() => editarAula(aulaModal)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: '#f59e0b',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    onClick={() => excluirAula(aulaModal.id)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-trash"></i> Excluir
                  </button>
                </>
              )}
              <button
                onClick={() => setAulaModal(null)}
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
              {!isAdmin && (
                <button
                  onClick={() => inscreverAula(aulaModal.id)}
                  disabled={aulaModal.ocupadas >= aulaModal.vagas}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: aulaModal.ocupadas >= aulaModal.vagas ? '#cbd5e1' : aulaModal.cor,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: aulaModal.ocupadas >= aulaModal.vagas ? 'not-allowed' : 'pointer'
                  }}
                >
                  {aulaModal.ocupadas >= aulaModal.vagas ? 'Lotada' : 'Inscrever-se'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editModal && (
        <div 
          onClick={() => setEditModal(null)}
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
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                Editar Aula
              </h2>
              <button 
                onClick={() => setEditModal(null)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Tipo de Aula
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Gi">Gi (Kimono)</option>
                  <option value="No-Gi">No-Gi</option>
                  <option value="Sparring">Sparring</option>
                  <option value="Open Mat">Open Mat</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Nível
                </label>
                <select
                  value={formData.nivel}
                  onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Professor
                </label>
                <input
                  type="text"
                  value={formData.professor}
                  onChange={(e) => setFormData({...formData, professor: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                    Hora Início
                  </label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                    Hora Fim
                  </label>
                  <input
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Vagas
                </label>
                <input
                  type="number"
                  value={formData.vagas}
                  onChange={(e) => setFormData({...formData, vagas: parseInt(e.target.value)})}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setEditModal(null)}
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
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-save"></i> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Aula */}
      {criarAulaModal && (
        <div 
          onClick={() => setCriarAulaModal(null)}
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
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                Nova Aula
              </h2>
              <button 
                onClick={() => setCriarAulaModal(null)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Dia da Semana
                </label>
                <select
                  value={criarAulaModal.dia}
                  onChange={(e) => setCriarAulaModal({...criarAulaModal, dia: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  {diasSemana.map((dia, index) => (
                    <option key={index} value={index}>{dia}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Tipo de Aula
                </label>
                <select
                  value={formData.tipo || 'Gi'}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Gi">Gi (Kimono)</option>
                  <option value="No-Gi">No-Gi</option>
                  <option value="Sparring">Sparring</option>
                  <option value="Open Mat">Open Mat</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Nível
                </label>
                <select
                  value={formData.nivel || 'Todos'}
                  onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Professor
                </label>
                <select
                  value={formData.professorId || ''}
                  onChange={(e) => setFormData({...formData, professorId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Selecione um professor</option>
                  {professores.map(prof => (
                    <option key={prof.id} value={prof.id}>{prof.nome}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                    Hora Início
                  </label>
                  <input
                    type="time"
                    value={criarAulaModal.hora}
                    onChange={(e) => setCriarAulaModal({...criarAulaModal, hora: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                    Hora Fim
                  </label>
                  <input
                    type="time"
                    value={formData.horaFim || ''}
                    onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                  Vagas
                </label>
                <input
                  type="number"
                  value={formData.vagas || 20}
                  onChange={(e) => setFormData({...formData, vagas: parseInt(e.target.value)})}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setCriarAulaModal(null)}
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
                Cancelar
              </button>
              <button
                onClick={criarNovaAula}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-plus"></i> Criar Aula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GradeAulas
