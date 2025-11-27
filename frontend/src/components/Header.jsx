import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Sistema de Gerenciamento de Jiu-Jitsu</h1>
        <div className="header-user">
          <span>Olá, {user?.name || 'Usuário'}</span>
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
