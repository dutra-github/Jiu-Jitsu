const { render, screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');
const { MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const Dashboard = require('../../components/Dashboard').default;
const { AuthProvider } = require('../../context/AuthContext');

// Mock do API axios
jest.mock('../../services/api', () => ({
  defaults: {
    baseURL: '/api',
    headers: {}
  },
  get: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
}));

// Mock dos componentes filhos
jest.mock('../../components/Header', () => {
  return function DummyHeader() { 
    return <div data-testid="header-component">Header Mockado</div>; 
  }
});

jest.mock('../../components/Sidebar', () => {
  return function DummySidebar() { 
    return <div data-testid="sidebar-component">Sidebar Mockado</div>; 
  }
});

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do context
const mockUser = { id: 1, name: 'Usuário Teste', email: 'usuario@teste.com' };
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: mockUser,
    loading: false,
    error: null
  })
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

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    api.get.mockClear();
    mockNavigate.mockClear();
  });

  it('deve renderizar o dashboard corretamente para usuário autenticado', async () => {
    // Mockando os dados do dashboard
    const mockDashboardData = {
      activeStudents: 42,
      birthdays: 3,
      pendingGraduations: 5,
      overduePayments: 7,
      nextPayments: 10,
      financialBalance: 15000.75
    };

    // Configurando o mock da API
    api.get.mockResolvedValueOnce({ data: mockDashboardData });

    // Simular que o usuário está autenticado
    localStorage.setItem('token', 'token-autenticado');
    
    renderWithProviders(<Dashboard />);

    // Verificar se os componentes base foram renderizados
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-component')).toBeInTheDocument();
    
    // Verificar mensagem de boas-vindas com o nome do usuário
    expect(screen.getByText(`Bem-vindo, ${mockUser.name}`)).toBeInTheDocument();
    
    // Verificar se a API foi chamada para buscar os dados do dashboard
    expect(api.get).toHaveBeenCalledWith('/dashboard');
    
    // Aguardar e verificar se os dados do dashboard foram carregados corretamente
    await waitFor(() => {
      // Verificar se os cards do dashboard mostram os valores corretos
      expect(screen.getByText('42')).toBeInTheDocument(); // activeStudents
      expect(screen.getByText('3')).toBeInTheDocument(); // birthdays
      expect(screen.getByText('5')).toBeInTheDocument(); // pendingGraduations
      expect(screen.getByText('7')).toBeInTheDocument(); // overduePayments
      expect(screen.getByText('10')).toBeInTheDocument(); // nextPayments
      expect(screen.getByText(`R$ ${mockDashboardData.financialBalance.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it('deve lidar com erro ao buscar dados do dashboard', async () => {
    // Configurar o mock para simular um erro na API
    console.error = jest.fn(); // Mock do console.error
    api.get.mockRejectedValueOnce(new Error('Erro ao buscar dados'));

    // Simular usuário autenticado
    localStorage.setItem('token', 'token-autenticado');
    
    renderWithProviders(<Dashboard />);
    
    // Verificar se a API foi chamada
    expect(api.get).toHaveBeenCalledWith('/dashboard');
    
    // Verificar se o erro foi logado
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar dados do dashboard:', 
        expect.any(Error)
      );
    });
  });

  // Teste para verificar se os botões de ação estão presentes
  it('deve mostrar botões de ação no dashboard', async () => {
    // Mock para dados do dashboard
    api.get.mockResolvedValueOnce({ 
      data: { 
        activeStudents: 0, 
        birthdays: 0, 
        pendingGraduations: 0, 
        overduePayments: 0, 
        nextPayments: 0, 
        financialBalance: 0 
      } 
    });

    renderWithProviders(<Dashboard />);
    
    // Verificar se todos os botões de ação estão presentes
    expect(screen.getByText('Cadastrar Aluno')).toBeInTheDocument();
    expect(screen.getByText('Agendar Aula')).toBeInTheDocument();
    expect(screen.getByText('Marcar Graduação')).toBeInTheDocument();
    expect(screen.getByText('Registrar Pagamento')).toBeInTheDocument();
  });
});
