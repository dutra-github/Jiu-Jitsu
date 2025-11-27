import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Professores() {
  const [professores, setProfessores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProfessores()
  }, [])

  const fetchProfessores = async () => {
    try {
      const response = await api.get('/professores')
      setProfessores(response.data)
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfessores = professores.filter(prof =>
    prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Gestão de Professores</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Gerencie os professores da academia</p>
        </div>
        <Link
          to="/professores/novo"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '0.875rem 1.75rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="fas fa-plus"></i> Novo Professor
        </Link>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

      {filteredProfessores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px' }}>
          <i className="fas fa-chalkboard-teacher" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
          <h3>Nenhum professor encontrado</h3>
          <p style={{ color: '#64748b' }}>Comece cadastrando seu primeiro professor</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>PROFESSOR</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>CONTATO</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AULAS</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>STATUS</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.875rem' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.map(professor => (
              <tr key={professor.id} style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <td style={{ padding: '1.25rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: '700'
                    }}>
                      {professor.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{professor.nome}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{professor.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem', color: '#475569' }}>
                  {professor.telefone || 'Não informado'}
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <span style={{
                    background: '#eff6ff',
                    color: '#3b82f6',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {professor._count?.aulas || 0} aulas
                  </span>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <span style={{
                    background: professor.ativo ? '#ecfdf5' : '#fef2f2',
                    color: professor.ativo ? '#059669' : '#dc2626',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link 
                      to={`/professores/editar/${professor.id}`}
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

export default Professores
