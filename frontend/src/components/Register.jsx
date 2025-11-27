import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register(formData.nome, formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Sistema de Jiu-Jitsu</h1>
        <h2>Criar Conta</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Seu nome completo"
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
              required
              disabled={loading}
              placeholder="seu@email.com"
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
              required
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Repita a senha"
            />
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
