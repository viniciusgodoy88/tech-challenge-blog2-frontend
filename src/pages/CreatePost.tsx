import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/posts', {
      title,
      content,
      author: user?.name || 'Docente',
      summary: content.slice(0, 100) + '...',
    });
    navigate('/admin');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Nova Postagem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            style={{ width: '100%', padding: '0.5rem' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label>Conteúdo:</label>
          <textarea
            style={{ width: '100%', padding: '0.5rem' }}
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.7rem 1.5rem' }}>
          Publicar Post
        </button>
      </form>
    </div>
  );
};