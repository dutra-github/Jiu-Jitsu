/* eslint-env jest */
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter, MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const userEvent = require('@testing-library/user-event');
const Login = require('../../components/Login').default;

/* eslint-env jest */
// Mock do localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock do useAuth
const mockLogin = jest.fn()
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    loading: false,
    error: null,
    setError: jest.fn()
  })
}))

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('should show error for invalid email', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    expect(await screen.findByText('Por favor, insira um email válido')).toBeInTheDocument()
  })

  it('should show error for short password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText('Senha')
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)

    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('should call login and redirect on successful login', async () => {
    // Mock de uma resposta bem-sucedida
    mockLogin.mockResolvedValue({ success: true })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    // Usar userEvent para interação mais realista
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      // Verificar se a função de login foi chamada com os parâmetros corretos
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      
      // Verificar redirecionamento para dashboard
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('should show error on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciais inválidas'))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })
})
