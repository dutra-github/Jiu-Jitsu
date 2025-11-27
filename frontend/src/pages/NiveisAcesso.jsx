import React from 'react'

function NiveisAcesso() {
  const niveis = [
    { id: 1, nome: 'Admin', descricao: 'Acesso total ao sistema', cor: '#dc2626', icon: 'shield-alt' },
    { id: 2, nome: 'Professor', descricao: 'Gerenciar aulas e presenças', cor: '#3b82f6', icon: 'chalkboard-teacher' },
    { id: 3, nome: 'Aluno', descricao: 'Visualizar e se inscrever em aulas', cor: '#059669', icon: 'user' }
  ]

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Níveis de Acesso</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Configure as permissões de cada função</p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {niveis.map(nivel => (
          <div key={nivel.id} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: nivel.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                <i className={`fas fa-${nivel.icon}`}></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>{nivel.nome}</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>{nivel.descricao}</p>
              </div>
            </div>
            <button style={{ background: 'transparent', color: '#3b82f6', padding: '0.5rem 0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>Configurar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NiveisAcesso
