import React, { useState, useEffect } from 'react'
import api from '../services/api'

function Graduacoes() {
  const [alunosAptos, setAlunosAptos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlunosAptos()
  }, [])

  const fetchAlunosAptos = async () => {
    try {
      const response = await api.get('/alunos/aptos-graduacao')
      setAlunosAptos(response.data)
    } catch (error) {
      console.error('Erro ao buscar alunos aptos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGraduar = async (alunoId) => {
    if (!window.confirm('Confirma a graduação deste aluno?')) return

    try {
      await api.put(`/alunos/${alunoId}/graduar`)
      alert('Aluno graduado com sucesso!')
      fetchAlunosAptos()
    } catch (error) {
      console.error('Erro ao graduar aluno:', error)
      alert('Erro ao graduar aluno: ' + (error.response?.data?.error || error.message))
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

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Graduações</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Alunos aptos para graduação</p>
      </div>

      {alunosAptos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
          <i className="fas fa-medal" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3>Nenhum aluno apto para graduação</h3>
          <p style={{ color: '#64748b' }}>Os alunos aparecerão aqui quando atingirem os requisitos</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ALUNO</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>FAIXA ATUAL</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AULAS</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>TEMPO</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {alunosAptos.map(aluno => (
              <tr key={aluno.id} style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <td style={{ padding: '1.25rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: '700'
                    }}>
                      {aluno.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{aluno.nome}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{aluno.email}</div>
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
                <td style={{ padding: '1.25rem', color: '#475569' }}>
                  {aluno.totalAulas || 0} aulas
                </td>
                <td style={{ padding: '1.25rem', color: '#475569' }}>
                  {aluno.mesesNaFaixa || 0} meses
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                  <button
                    onClick={() => handleGraduar(aluno.id)}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-medal"></i> Graduar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Graduacoes
