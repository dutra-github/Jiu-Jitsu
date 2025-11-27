/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RootRedirect from '../../components/RootRedirect';

// Mock do AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/test' })
  };
});

// Importando useAuth após o mock
const { useAuth } = require('../../context/AuthContext');

describe('RootRedirect Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should not redirect when authentication is loading', () => {
    // Simulando estado de loading
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <RootRedirect />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Simulando usuário não autenticado
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <RootRedirect />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('should redirect to dashboard when user is authenticated', () => {
    // Simulando usuário autenticado
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: 1, name: 'Teste' }
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <RootRedirect />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('should redirect to lastAttemptedRoute when available and user is authenticated', () => {
    // Configurando rota anterior tentada
    localStorage.setItem('lastAttemptedRoute', '/perfil');
    
    // Simulando usuário autenticado
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: 1, name: 'Teste' }
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <RootRedirect />
      </MemoryRouter>
    );

    // Deve navegar para a última rota tentada
    expect(mockNavigate).toHaveBeenCalledWith('/perfil', { replace: true });
    // Verificar se a rota foi removida do localStorage
    expect(localStorage.getItem('lastAttemptedRoute')).toBeNull();
  });
});
