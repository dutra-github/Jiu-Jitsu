import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute - Componente simplificado que protege rotas
 * Redireciona para página de login se o usuário não estiver autenticado
 */
const ProtectedRoute = () => {
  // Obter estado de autenticação do contexto
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  
  // Mostrar indicador de carregamento enquanto a verificação de autenticação está em andamento
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Verificando autenticação...</p>
      </div>
    )
  }
  
  // Se não estiver autenticado após a verificação, redirecionar para login
  if (!isAuthenticated) {
    // Armazenar a localização atual para redirecionar de volta após o login bem-sucedido
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // Se autenticado, renderizar o conteúdo protegido
  return <Outlet />
}
