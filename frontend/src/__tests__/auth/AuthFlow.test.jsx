const { render, screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const { AuthProvider } = require('../../context/AuthContext');
const Login = require('../../components/Login').default;

// Mock do API axios
jest.mock('../../services/api', () => ({
  defaults: {
    baseURL: '/api',
    headers: {}
  },
  post: jest.fn(),
  get: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Funções de suporte
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Fluxo completo de autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    api.post.mockClear();
    api.get.mockClear();
    mockNavigate.mockClear();
  });

  it('deve armazenar token no localStorage após login bem-sucedido', async () => {
    // Configurar mock para o login
    api.post.mockResolvedValueOnce({
      data: {
        user: { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' },
        token: 'token-jwt-teste'
      }
    });

    renderWithProviders(<Login />);

    // Preencher formulário
    await userEvent.type(screen.getByLabelText(/email/i), 'usuario@teste.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123456');
    
    // Clicar no botão de login
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar se o token foi armazenado
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token-jwt-teste');
      expect(api.defaults.headers.Authorization).toBe('Bearer token-jwt-teste');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('deve lidar corretamente com credenciais inválidas', async () => {
    // Configurar erro de autenticação
    api.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: 'Credenciais inválidas' }
      }
    });

    renderWithProviders(<Login />);

    // Preencher formulário
    await userEvent.type(screen.getByLabelText(/email/i), 'usuario@teste.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha-errada');
    
    // Clicar no botão de login
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i, { exact: false })).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('deve verificar compatibilidade com diferentes navegadores para armazenamento de token', async () => {
    // Configurar mock para o login
    api.post.mockResolvedValueOnce({
      data: {
        user: { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' },
        token: 'token-jwt-teste'
      }
    });

    // Testar com implementação específica para Chrome/Edge
    const chromeStorage = {
      getItem: jest.fn((key) => chromeStorage.store[key] || null),
      setItem: jest.fn((key, value) => {
        chromeStorage.store[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete chromeStorage.store[key];
      }),
      clear: jest.fn(() => {
        chromeStorage.store = {};
      }),
      store: {}
    };

    // Substituir o localStorage original
    const originalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      value: chromeStorage,
      configurable: true
    });

    renderWithProviders(<Login />);

    // Preencher formulário e fazer login
    await userEvent.type(screen.getByLabelText(/email/i), 'usuario@teste.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senha123456');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar se o token foi armazenado corretamente
    await waitFor(() => {
      expect(chromeStorage.setItem).toHaveBeenCalledWith('token', 'token-jwt-teste');
      expect(chromeStorage.store.token).toBe('token-jwt-teste');
    });

    // Restaurar o localStorage original
    Object.defineProperty(window, 'localStorage', originalStorage);
  });

  it('deve inicializar a API com token existente no localStorage', async () => {
    // Simular token já existente no localStorage
    localStorage.setItem('token', 'token-pre-existente');
    
    // Recriar uma instância do módulo api para testar a inicialização
    jest.resetModules();
    const apiModule = await import('../../services/api');
    
    // Verificar se o token foi configurado automaticamente nos headers
    expect(apiModule.default.defaults.headers.Authorization).toBe('Bearer token-pre-existente');
  });
});
