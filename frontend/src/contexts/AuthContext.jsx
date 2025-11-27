import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@JiuJitsu:token');
    const savedUser = localStorage.getItem('@JiuJitsu:user');

    if (token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      // Salvar no localStorage
      localStorage.setItem('@JiuJitsu:token', token);
      localStorage.setItem('@JiuJitsu:user', JSON.stringify(userData));

      // Configurar header padrão do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login'
      };
    }
  };

  const register = async (nome, email, password) => {
    try {
      const response = await api.post('/auth/register', { nome, email, password });
      const { user: userData, token } = response.data;

      // Salvar no localStorage
      localStorage.setItem('@JiuJitsu:token', token);
      localStorage.setItem('@JiuJitsu:user', JSON.stringify(userData));

      // Configurar header padrão do axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao registrar'
      };
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('@JiuJitsu:token');
    localStorage.removeItem('@JiuJitsu:user');

    // Limpar header do axios
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

export default AuthContext;
