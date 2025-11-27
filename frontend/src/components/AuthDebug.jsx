import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Componente de depuração para visualizar o estado da autenticação
export default function AuthDebug() {
  const [token, setToken] = useState(null)
  const [tokenLength, setTokenLength] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { user, signed } = useAuth()

  // Atualizar token a cada segundo para depuração
  useEffect(() => {
    function checkToken() {
      const currentToken = localStorage.getItem('token')
      setToken(currentToken)
      setTokenLength(currentToken ? currentToken.length : 0)
      setLastUpdated(new Date())
    }

    // Verificar imediatamente
    checkToken()

    // Continuar verificando a cada segundo
    const interval = setInterval(checkToken, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const headerStyle = {
    backgroundColor: '#222',
    color: 'white',
    padding: '10px',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: '9999',
    fontSize: '14px',
    fontFamily: 'monospace',
    borderTop: '2px solid #f00'
  }

  return (
    <div style={headerStyle}>
      <div>
        <strong>Debug Auth:</strong> {signed ? 'Autenticado ✓' : 'Não Autenticado ✗'} | 
        <strong> Token:</strong> {token ? `${token.substring(0, 15)}...` : 'Nenhum'} | 
        <strong> Tamanho:</strong> {tokenLength} bytes | 
        <strong> Usuário:</strong> {user ? `${user.name} (ID: ${user.id})` : 'Nenhum'} | 
        <strong> Atualizado:</strong> {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  )
}
