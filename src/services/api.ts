import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para injetar o Token JWT tratado
api.interceptors.request.use((config) => {
  // Busca em todas as chaves comuns
  let token =
    localStorage.getItem('token') ||
    localStorage.getItem('@Blog:token') ||
    localStorage.getItem('@App:token');

  if (token) {
    // Remove aspas duplas residuais caso o token tenha sido salvo com JSON.stringify
    token = token.replace(/^"|"$/g, '').trim();

    // Garante o formato 'Bearer <token>'
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      console.warn('Sessão inválida ou expirada no backend.');
    }
    return Promise.reject(error);
  }
);