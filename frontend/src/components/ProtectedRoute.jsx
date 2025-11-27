import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

/**
 * ProtectedRoute - Componente que protege rotas
 * Redireciona para página de login se o usuário não estiver autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { signed, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return <Loading />
  }
  
  if (!signed) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

export default ProtectedRoute
