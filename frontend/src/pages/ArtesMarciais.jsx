import React, { useState, useEffect } from 'react'
import api from '../services/api'

function ArtesMarciais() {
  const [artes, setArtes] = useState([])
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({ nome: '', ativo: true })

  useEffect(() => { fetchArtes() }, [])

  const fetchArtes = async () => {
    try {
      const response = await api.get('/artes-marciais')
      setArtes(response.data)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal.tipo === 'criar') {
        await api.post('/artes-marciais', formData)
      } else {
        await api.put(`/artes-marciais/${modal.id}`, formData)
      }
      alert('Salvo!')
      setModal(null)
      fetchArtes()
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.error || error.message))
    }
  }

  const abrirModal = (tipo, item = null) => {
    if (tipo === 'criar') {
      setFormData({ nome: '', ativo: true })
      setModal({ tipo: 'criar' })
    } else {
      setFormData({ nome: item.nome, ativo: item.ativo })
      setModal({ tipo: 'editar', id: item.id })
    }
  }

  const deletar = async (id) => {
    if (!confirm('Excluir?')) return
    try {
      await api.delete(`/artes-marciais/${id}`)
      alert('Excluído!')
      fetchArtes()
    } catch (error) {
      alert('Erro')
    }
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Artes Marciais</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Gerencie as modalidades disponíveis</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <button onClick={() => abrirModal('criar')} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            <i className="fas fa-plus"></i> Nova Modalidade
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Nome</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {artes.map((arte, index) => (
              <tr key={arte.id} style={{ borderBottom: index < artes.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{arte.nome}</span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: arte.ativo ? '#ecfdf5' : '#fef2f2', color: arte.ativo ? '#059669' : '#dc2626' }}>
                    {arte.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => abrirModal('editar', arte)} style={{ background: 'transparent', color: '#3b82f6', padding: '0.5rem 0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', marginRight: '1rem' }}>Editar</button>
                  <button onClick={() => deletar(arte.id)} style={{ background: 'transparent', color: '#dc2626', padding: '0.5rem 0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artes.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <i className="fas fa-fist-raised" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
            <p>Nenhuma modalidade cadastrada</p>
          </div>
        )}
      </div>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{modal.tipo === 'criar' ? 'Nova Modalidade' : 'Editar Modalidade'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Nome *</label>
                <input required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Jiu-Jitsu Brasileiro" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.ativo} onChange={(e) => setFormData({...formData, ativo: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>Ativo</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, padding: '0.75rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtesMarciais
