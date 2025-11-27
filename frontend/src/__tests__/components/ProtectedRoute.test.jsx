/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mock do AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    Navigate: jest.fn(({ to }) => <div data-testid="mock-navigate">Redirecionando para {to}</div>)
  };
});

// Importando useAuth após o mock
const { useAuth } = require('../../context/AuthContext');

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state when authentication is loading', () => {
    // Simulando estado de loading
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Simulando usuário não autenticado
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-navigate')).toBeInTheDocument();
    expect(screen.getByText('Redirecionando para /login')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    // Simulando usuário autenticado
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: 1, name: 'Teste' }
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  it('should allow access in diagnostic mode even when not authenticated', () => {
    // Configurar modo diagnóstico
    jest.spyOn(window.sessionStorage, 'getItem').mockImplementation(key => {
      if (key === 'diagnostic_redirect') return 'true';
      return null;
    });
    
    // Simulando usuário não autenticado
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Deve mostrar o conteúdo protegido mesmo sem autenticação
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });
});
