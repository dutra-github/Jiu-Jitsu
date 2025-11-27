import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/api'

function DetalhesAluno() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [aluno, setAluno] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAluno()
  }, [id])

  const fetchAluno = async () => {
    try {
      const response = await api.get(`/alunos/${id}`)
      setAluno(response.data)
    } catch (error) {
      console.error('Erro ao buscar aluno:', error)
      alert('Erro ao carregar dados do aluno')
      navigate('/alunos/lista')
    } finally {
      setLoading(false)
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

  if (!aluno) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Aluno não encontrado</div>
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Detalhes do Aluno</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Informações completas</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            to={`/alunos/editar/${aluno.id}`}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button
            onClick={() => navigate('/alunos/lista')}
            style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Voltar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Card Principal */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: '700',
              margin: '0 auto 1rem'
            }}>
              {aluno.nome.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
              {aluno.nome}
            </h2>
            <div style={{ 
              fontFamily: 'monospace', 
              fontWeight: '600', 
              color: '#3b82f6',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
              Matrícula: {aluno.matricula}
            </div>
            <span style={{
              ...getBeltStyle(aluno.faixa),
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'inline-block'
            }}>
              {aluno.faixa} - {aluno.grau}º grau
            </span>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>STATUS</div>
              <span style={{
                background: aluno.ativo ? '#ecfdf5' : '#fef2f2',
                color: aluno.ativo ? '#059669' : '#dc2626',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {aluno.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Informações Detalhadas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dados Pessoais */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
              Dados Pessoais
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>EMAIL</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{aluno.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>TELEFONE</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{aluno.telefone || 'Não informado'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>CPF</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{aluno.cpf || 'Não informado'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>DATA DE NASCIMENTO</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>ENDEREÇO</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{aluno.endereco || 'Não informado'}</div>
              </div>
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
              Informações Acadêmicas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>DATA DE INÍCIO</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {aluno.dataInicio ? new Date(aluno.dataInicio).toLocaleDateString('pt-BR') : 'Não informado'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>AULAS DESDE ÚLTIMA GRADUAÇÃO</div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{aluno.aulasDesdeUltGrad || 0}</div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {aluno.observacoes && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                Observações
              </h3>
              <p style={{ margin: 0, color: '#475569', lineHeight: '1.6' }}>{aluno.observacoes}</p>
            </div>
          )}

          {/* Informações de Saúde */}
          {aluno.saude && (
            <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '2rem', border: '2px solid #fbbf24' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-heartbeat"></i> Informações de Saúde
              </h3>
              <p style={{ margin: 0, color: '#92400e', lineHeight: '1.6', fontWeight: '500' }}>{aluno.saude}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalhesAluno
