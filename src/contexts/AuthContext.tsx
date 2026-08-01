import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// 🔴 Atualizado para incluir 'SUPERADMIN' além de TEACHER e STUDENT
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'SUPERADMIN' | 'TEACHER' | 'STUDENT' | string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorageData() {
      // Suporte tanto para as chaves com prefixo quanto sem prefixo para evitar incompatibilidade
      const storagedUser = localStorage.getItem('@Blog:user') || localStorage.getItem('user');
      const storagedToken = localStorage.getItem('@Blog:token') || localStorage.getItem('token');

      if (storagedToken && storagedUser) {
        try {
          const parsedUser = JSON.parse(storagedUser);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
        } catch (error) {
          console.error('Erro ao ler dados do localStorage:', error);
          clearStorage();
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const clearStorage = () => {
    localStorage.removeItem('@Blog:token');
    localStorage.removeItem('@Blog:user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const login = (token: string, userData: User) => {
    // Garante gravação em ambos os padrões para compatibilidade total com interceptors
    localStorage.setItem('@Blog:token', token);
    localStorage.setItem('@Blog:user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    clearStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}