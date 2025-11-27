import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Register.css'

/**
 * Componente Register simplificado
 * - Formulário com validação básica
 * - Integração com AuthContext para registro
 * - Redirecionamento para login após sucesso
 */
const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Manipulador para alterações nos campos
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro quando o usuário digita
    setError('')
  }

  // Validação do formulário
  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres')
      return false
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido')
      return false
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não correspondem')
      return false
    }

    return true
  }

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      console.log(' Iniciando registro para:', formData.email)
      
      // Chamar função de registro do contexto
      await register(formData.name, formData.email, formData.password)
      
      // Redirecionar para login com indicador de sucesso
      console.log(' Registro realizado com sucesso')
      navigate('/login', { 
        replace: true,
        state: { registered: true } 
      })
    } catch (err) {
      console.error(' Erro no registro:', err)
      setError(err.message || 'Erro ao registrar conta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Criar Conta</h2>
        
        {/* Mensagem de erro */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              minLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        
        <div className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
