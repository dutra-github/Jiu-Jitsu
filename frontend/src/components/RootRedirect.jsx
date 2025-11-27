import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * RootRedirect - Componente simplificado que sempre redireciona para o dashboard
 * Versão modificada sem autenticação
 */
const RootRedirect = () => {
  return <Navigate to="/dashboard" replace />
}
