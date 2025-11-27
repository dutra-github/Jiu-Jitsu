import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Register from '../../components/Register'

// Mock do useAuth e useNavigate
const mockRegister = jest.fn()
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    error: null,
    setError: jest.fn(),
    successMessage: null,
    setSuccessMessage: jest.fn()
  })
}))

describe('Register Component', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render register form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument()
  })

  it('should show error when fields are empty', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const registerButton = screen.getByRole('button', { name: 'Registrar' })
    fireEvent.click(registerButton)

    expect(await screen.findByText('Preencha todos os campos')).toBeInTheDocument()
  })

  it('should show error when passwords dont match', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText('Senha')
    const confirmInput = screen.getByLabelText('Confirmar Senha')
    const registerButton = screen.getByRole('button', { name: 'Registrar' })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'different' } })
    fireEvent.click(registerButton)

    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument()
  })

  it('should redirect to login on successful registration', async () => {
    mockRegister.mockResolvedValue(true)
    
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('should show error message on registration failure', async () => {
    mockRegister.mockRejectedValue(new Error('Email já cadastrado'))
    
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar Senha'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(await screen.findByText('Email já cadastrado')).toBeInTheDocument()
  })
})
