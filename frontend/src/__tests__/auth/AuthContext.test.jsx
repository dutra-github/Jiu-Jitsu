const { render, screen, waitFor, act } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const { AuthProvider, useAuth } = require('../../context/AuthContext');

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
  useNavigate: () => mockNavigate
}));

// Componente de teste para acessar o contexto
function TestComponent({ testFunction }) {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user-data">{JSON.stringify(auth.user)}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="error">{auth.error}</div>
      <button onClick={() => testFunction(auth)}>Teste Função</button>
    </div>
  );
}

// Função para renderizar o componente de teste com o Provider
function renderWithAuthProvider(testFunction = () => {}) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestComponent testFunction={testFunction} />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    api.post.mockReset();
    api.get.mockReset();
    mockNavigate.mockReset();
  });

  it('deve iniciar com usuário nulo e loading false', () => {
    renderWithAuthProvider();
    
    expect(screen.getByTestId('user-data')).toHaveTextContent('');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('deve tentar carregar usuário do token ao inicializar', async () => {
    // Simular token existente
    localStorage.setItem('token', 'token-teste');
    
    // Mock da resposta da API para verificação de usuário
    const mockUser = { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' };
    api.get.mockResolvedValueOnce({ data: mockUser });
    
    renderWithAuthProvider();
    
    // Verificar se a API foi chamada com o endpoint correto
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    
    // Aguardar e verificar se o usuário foi definido no contexto
    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  it('deve limpar token se a verificação falhar', async () => {
    // Simular token existente mas inválido
    localStorage.setItem('token', 'token-invalido');
    
    // Mock de erro na API
    api.get.mockRejectedValueOnce({ response: { status: 401 } });
    
    renderWithAuthProvider();
    
    // Verificar se a API foi chamada
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    
    // Aguardar e verificar se o token foi removido e o usuário continua nulo
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByTestId('user-data')).toHaveTextContent('');
    });
  });

  it('deve realizar login corretamente', async () => {
    // Mock da resposta da API para login
    const mockUser = { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' };
    const mockToken = 'token-jwt-teste';
    api.post.mockResolvedValueOnce({ 
      data: { 
        user: mockUser, 
        token: mockToken 
      } 
    });
    
    // Renderizar com função de teste que chama o login
    let loginFunction;
    renderWithAuthProvider((auth) => {
      loginFunction = auth.login;
    });
    
    // Executar função de login
    await act(async () => {
      await userEvent.click(screen.getByText('Teste Função'));
      await loginFunction('usuario@teste.com', 'senha123');
    });
    
    // Verificar se a API foi chamada corretamente
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'usuario@teste.com',
      password: 'senha123'
    });
    
    // Verificar se o token foi armazenado
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    
    // Verificar se o header de Authorization foi configurado
    expect(api.defaults.headers.Authorization).toBe(`Bearer ${mockToken}`);
    
    // Verificar se o usuário foi definido no contexto
    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(mockUser));
    });
    
    // Verificar se houve redirecionamento para dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('deve lidar com erro no login', async () => {
    // Mock de erro na API
    const errorMessage = 'Credenciais inválidas';
    api.post.mockRejectedValueOnce({ 
      response: { 
        status: 401, 
        data: { error: errorMessage } 
      } 
    });
    
    // Renderizar com função de teste
    let loginFunction;
    renderWithAuthProvider((auth) => {
      loginFunction = auth.login;
    });
    
    // Executar função de login
    await act(async () => {
      await userEvent.click(screen.getByText('Teste Função'));
      try {
        await loginFunction('usuario@teste.com', 'senha-errada');
      } catch (error) {
        // Esperado falhar
      }
    });
    
    // Verificar se a API foi chamada
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'usuario@teste.com',
      password: 'senha-errada'
    });
    
    // Verificar se o erro foi definido no contexto
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
    });
    
    // Verificar se o token não foi armazenado
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('deve realizar logout corretamente', async () => {
    // Simular usuário logado
    localStorage.setItem('token', 'token-teste');
    api.defaults.headers.Authorization = 'Bearer token-teste';
    
    const mockUser = { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' };
    api.get.mockResolvedValueOnce({ data: mockUser });
    
    // Renderizar com função de teste que chama o logout
    let logoutFunction;
    renderWithAuthProvider((auth) => {
      logoutFunction = auth.logout;
    });
    
    // Aguardar carregamento do usuário
    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(mockUser));
    });
    
    // Executar função de logout
    await act(async () => {
      await userEvent.click(screen.getByText('Teste Função'));
      logoutFunction();
    });
    
    // Verificar se o token foi removido
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    
    // Verificar se o header de Authorization foi removido
    expect(api.defaults.headers.Authorization).toBeUndefined();
    
    // Verificar se o usuário foi definido como null no contexto
    expect(screen.getByTestId('user-data')).toHaveTextContent('');
    
    // Verificar se houve redirecionamento para login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
