import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Alunos.css'

function Alunos() {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAlunos()
  }, [])

  const fetchAlunos = async () => {
    try {
      const response = await api.get('/alunos')
      setAlunos(response.data)
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Gestão de Alunos</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Gerencie todos os alunos cadastrados</p>
        </div>
        <Link 
          to="/alunos/novo" 
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '0.875rem 1.75rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="fas fa-plus"></i> Novo Aluno
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '0.875rem 1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {filteredAlunos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
          <i className="fas fa-users" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3>Nenhum aluno encontrado</h3>
          <p style={{ color: '#64748b' }}>Comece cadastrando seu primeiro aluno</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>ALUNO</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>FAIXA</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>MATRÍCULA</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>TELEFONE</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlunos.map(aluno => (
              <tr key={aluno.id} style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <td style={{ padding: '1.25rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontWeight: '600', 
                    color: '#3b82f6',
                    fontSize: '0.95rem'
                  }}>
                    {aluno.matricula}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {aluno.dataInicio ? new Date(aluno.dataInicio).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </td>
                <td style={{ padding: '1.25rem', color: '#475569' }}>
                  {aluno.telefone || 'Não informado'}
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link 
                      to={`/alunos/editar/${aluno.id}`}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        padding: '0.625rem 1.25rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <Link 
                      to={`/alunos/${aluno.id}`}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '0.625rem 1.25rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#475569',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <i className="fas fa-eye"></i> Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Alunos
