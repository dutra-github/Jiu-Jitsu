import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function NovoProfessor() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', ativo: true })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/professores', formData)
      alert('Professor cadastrado com sucesso!')
      navigate('/professores/lista')
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Novo Professor</h1>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nome Completo *</label>
            <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Telefone</label>
            <input type="tel" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" onClick={() => navigate('/professores/lista')} style={{ flex: 1, padding: '1rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
          <button type="submit" style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', borderRadius: '8px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>Cadastrar</button>
        </div>
      </form>
    </div>
  )
}

export default NovoProfessor
