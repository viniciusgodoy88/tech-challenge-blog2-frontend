import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'STUDENT';
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
      const storagedUser = localStorage.getItem('@Blog:user');
      const storagedToken = localStorage.getItem('@Blog:token');

      if (storagedToken && storagedUser) {
        try {
          setUser(JSON.parse(storagedUser));
          api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        } catch (error) {
          console.error('Erro ao ler dados do localStorage:', error);
          localStorage.removeItem('@Blog:user');
          localStorage.removeItem('@Blog:token');
          setUser(null);
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('@Blog:token', token);
    localStorage.setItem('@Blog:user', JSON.stringify(userData));

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('@Blog:token');
    localStorage.removeItem('@Blog:user');

    delete api.defaults.headers.Authorization;
    setUser(null);
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

// 🔴 ESTA LINHA É A QUE FALTAVA PARA RESOLVER O ERRO DO SEU PRINT:
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}