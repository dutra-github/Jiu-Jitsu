import axios from 'axios'

/**
 * Serviço de API com autenticação JWT
 * - Usa caminhos relativos para o proxy do Vite
 * - Interceptors para adicionar token e tratar erros
 */

// Configuração básica do Axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
})

// Interceptor de requisição - adiciona token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@JiuJitsu:token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta - trata erros comuns
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Log de erro
    console.error('[API] Erro na requisição:', error.message)
    
    // Se erro 401 (não autorizado), limpar autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('@JiuJitsu:token')
      localStorage.removeItem('@JiuJitsu:user')
      
      // Redirecionar para login se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
