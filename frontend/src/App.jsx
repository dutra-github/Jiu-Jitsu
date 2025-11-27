import AppRoutes from './routes'

// Componente App simplificado sem AuthProvider
export default function App() {
  // Renderiza as rotas diretamente, sem contexto de autenticação
  return <AppRoutes />
}
