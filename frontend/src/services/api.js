import axios from 'axios'

/**
 * Serviço de API simplificado
 * - Usa caminhos relativos para o proxy do Vite
 * - Versão simplificada sem autenticação
 */

// Configuração básica do Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
})

// Interceptor de resposta - trata erros comuns
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Log de erro genérico
    console.error('[API] Erro na requisição:', error.message)
    
    return Promise.reject(error)
  }
)

export default api
