import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para injetar o Token JWT em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('@Blog:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona se a sessão estiver realmente expirada (401 sem token)
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);