import axios from 'axios';

// ==============================================================================
// INTERFACES E TIPOS DA API
// ==============================================================================

export interface Comment {
  id: number | string;
  author?: string | { name?: string; email?: string };
  content?: string;
  text?: string;
  parentId?: number | string | null;
  postId?: number | string;
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  author?: string;
  summary?: string;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  author?: string;
  summary?: string;
}

export interface CreateCommentDTO {
  content?: string;
  text?: string;
  postId?: string | number;
  parentId?: string | number | null;
  author?: string;
}

// ==============================================================================
// INSTÂNCIA DO AXIOS E INTERCEPTORS
// ==============================================================================

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para injetar o Token JWT tratado sem precisar de tipos complexos
api.interceptors.request.use(
  (config: any) => {
    let token =
      localStorage.getItem('token') ||
      localStorage.getItem('@Blog:token') ||
      localStorage.getItem('@App:token');

    if (token) {
      token = token.replace(/^"|"$/g, '').trim();

      config.headers = config.headers || {};
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);