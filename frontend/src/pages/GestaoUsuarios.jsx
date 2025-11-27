import React, { useState, useEffect } from 'react'
import api from '../services/api'

function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => { fetchUsuarios() }, [])

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/auth/users')
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Gestão de Usuários</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Gerencie os usuários do sistema</p>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Usuário</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Função</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user, index) => (
              <tr key={user.id} style={{ borderBottom: index < usuarios.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ color: '#64748b' }}>{user.email}</span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: '#eff6ff', color: '#1e40af' }}>
                    {user.role || 'aluno'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', color: '#3b82f6', padding: '0.5rem 0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            <p>Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestaoUsuarios
