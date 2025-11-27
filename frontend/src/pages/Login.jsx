import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../components/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      visibility: 'visible',
      opacity: 1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ color: 'red', textAlign: 'center', fontSize: '32px', fontWeight: 'bold' }}>🎯 SISTEMA DE JIU-JITSU</h1>
        <h2 style={{ color: '#333', textAlign: 'center', fontSize: '24px' }}>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p><strong>Credenciais de teste:</strong></p>
          <p>Email: admin@example.com</p>
          <p>Senha: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
