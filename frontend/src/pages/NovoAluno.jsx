import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function NovoAluno() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    faixa: 'Branca',
    grau: 0,
    dataInicio: new Date().toISOString().split('T')[0],
    observacoes: '',
    saude: '',
    ativo: true
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/alunos', formData)
      alert('Aluno cadastrado com sucesso!')
      navigate('/alunos/lista')
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error)
      
      let mensagemErro = 'Erro ao cadastrar aluno'
      
      if (error.response?.data?.error) {
        const erro = error.response.data.error
        
        if (erro.includes('email_key') || erro.includes('email')) {
          mensagemErro = 'Este email já está cadastrado no sistema!'
        } else if (erro.includes('cpf_key') || erro.includes('cpf')) {
          mensagemErro = 'Este CPF já está cadastrado no sistema!'
        } else {
          mensagemErro = erro
        }
      }
      
      alert(mensagemErro)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '100%', margin: 0 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Novo Aluno</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Cadastre um novo aluno no sistema</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
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
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
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
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
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
              Data de Nascimento
            </label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
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
              Faixa *
            </label>
            <select
              name="faixa"
              value={formData.faixa}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="Branca">Branca</option>
              <option value="Azul">Azul</option>
              <option value="Roxa">Roxa</option>
              <option value="Marrom">Marrom</option>
              <option value="Preta">Preta</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Grau *
            </label>
            <input
              type="number"
              name="grau"
              value={formData.grau}
              onChange={handleChange}
              min="0"
              max="4"
              required
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
              Data de Início *
            </label>
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
              placeholder="Informações adicionais sobre o aluno..."
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
              Informações de Saúde
            </label>
            <textarea
              name="saude"
              value={formData.saude}
              onChange={handleChange}
              rows="3"
              placeholder="Condições médicas, restrições, alergias, etc..."
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => navigate('/alunos/lista')}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '1rem',
              background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NovoAluno
