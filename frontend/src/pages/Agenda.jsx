import React, { useState, useEffect } from 'react'
import api from '../services/api'

function Agenda() {
  const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0])
  const [aulaId, setAulaId] = useState('1')
  const [alunos, setAlunos] = useState([])
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [presencas, setPresencas] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlunos()
  }, [])

  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos')
      setAlunos(response.data.filter(a => a.ativo))
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePresenca = (alunoId) => {
    setPresencas(prev => ({
      ...prev,
      [alunoId]: !prev[alunoId]
    }))
  }

  const marcarTodos = () => {
    const todasPresencas = {}
    alunos.forEach(aluno => {
      todasPresencas[aluno.id] = true
    })
    setPresencas(todasPresencas)
  }

  const desmarcarTodos = () => {
    setPresencas({})
  }

  const salvarPresencas = async () => {
    const presentes = Object.keys(presencas).filter(id => presencas[id])
    
    try {
      // Aqui você implementaria a chamada à API para salvar as presenças
      alert(`Presenças salvas! ${presentes.length} alunos presentes.`)
    } catch (error) {
      alert('Erro ao salvar presenças')
    }
  }

  const getBeltStyle = (faixa) => {
    const styles = {
      'Branca': { backgroundColor: '#f1f5f9', color: '#1e293b' },
      'Azul': { backgroundColor: '#3b82f6', color: '#ffffff' },
      'Roxa': { backgroundColor: '#8b5cf6', color: '#ffffff' },
      'Marrom': { backgroundColor: '#92400e', color: '#ffffff' },
      'Preta': { backgroundColor: '#1e293b', color: '#ffffff' }
    }
    return styles[faixa] || { backgroundColor: '#e2e8f0', color: '#1e293b' }
  }

  const totalPresentes = Object.values(presencas).filter(Boolean).length

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Controle de Presença</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Registre a presença dos alunos nas aulas</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Data da Aula
            </label>
            <input
              type="date"
              value={dataAula}
              onChange={(e) => setDataAula(e.target.value)}
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
              Horário da Aula
            </label>
            <select
              value={aulaId}
              onChange={(e) => setAulaId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="1">06:00 - 07:00 - Gi (Kimono)</option>
              <option value="2">19:00 - 20:30 - No-Gi</option>
              <option value="3">20:00 - 21:30 - Gi (Kimono)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={marcarTodos}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Marcar Todos
            </button>
            <button
              onClick={desmarcarTodos}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
          padding: '1rem', 
          borderRadius: '8px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Alunos Presentes</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{totalPresentes} / {alunos.length}</div>
          </div>
          <div style={{ fontSize: '3rem' }}>
            {alunos.length > 0 ? Math.round((totalPresentes / alunos.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {alunos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px' }}>
          <i className="fas fa-users" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3>Nenhum aluno ativo encontrado</h3>
          <p style={{ color: '#64748b' }}>Cadastre alunos para registrar presenças</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', width: '50px' }}>
                <input 
                  type="checkbox" 
                  checked={totalPresentes === alunos.length && alunos.length > 0}
                  onChange={(e) => e.target.checked ? marcarTodos() : desmarcarTodos()}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>MATRÍCULA</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ALUNO</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>FAIXA</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>STATUS</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map(aluno => (
              <tr 
                key={aluno.id} 
                style={{ 
                  backgroundColor: presencas[aluno.id] ? '#ecfdf5' : 'white', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <td style={{ padding: '1.25rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={presencas[aluno.id] || false}
                    onChange={() => togglePresenca(aluno.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontWeight: '600', 
                    color: '#3b82f6',
                    fontSize: '0.875rem'
                  }}>
                    {aluno.matricula}
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '700'
                    }}>
                      {aluno.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{aluno.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{aluno.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{
                    ...getBeltStyle(aluno.faixa),
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    display: 'inline-block'
                  }}>
                    {aluno.faixa} - {aluno.grau}º grau
                  </span>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  {presencas[aluno.id] ? (
                    <span style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      <i className="fas fa-check"></i> Presente
                    </span>
                  ) : (
                    <span style={{ 
                      background: '#f1f5f9', 
                      color: '#64748b', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      <i className="fas fa-minus"></i> Ausente
                    </span>
                  )}
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                  <button
                    onClick={() => setAlunoSelecionado(aluno)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      color: '#475569'
                    }}
                  >
                    <i className="fas fa-info-circle"></i> Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {alunos.length > 0 && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={salvarPresencas}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <i className="fas fa-save"></i> Salvar Presenças
          </button>
        </div>
      )}

      {/* Modal de Detalhes do Aluno */}
      {alunoSelecionado && (
        <div 
          onClick={() => setAlunoSelecionado(null)}
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
                Detalhes do Aluno
              </h2>
              <button 
                onClick={() => setAlunoSelecionado(null)}
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
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>NOME</div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>{alunoSelecionado.nome}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>MATRÍCULA</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#3b82f6' }}>{alunoSelecionado.matricula}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>EMAIL</div>
                <div style={{ fontWeight: '500', color: '#475569' }}>{alunoSelecionado.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>TELEFONE</div>
                <div style={{ fontWeight: '500', color: '#475569' }}>{alunoSelecionado.telefone || 'Não informado'}</div>
              </div>
              {alunoSelecionado.saude && (
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', border: '2px solid #fbbf24' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: '600' }}>
                    <i className="fas fa-heartbeat"></i> INFORMAÇÕES DE SAÚDE
                  </div>
                  <div style={{ color: '#92400e', fontSize: '0.875rem' }}>{alunoSelecionado.saude}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setAlunoSelecionado(null)}
              style={{
                width: '100%',
                marginTop: '1.5rem',
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Agenda
