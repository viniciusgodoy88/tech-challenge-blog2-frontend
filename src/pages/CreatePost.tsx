import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

const Container = styled.main`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1.5rem 4rem;
`;

const FormCard = styled.div`
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-top: 5px solid #ED145B;
`;

const Title = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #e2e8f0;
    font-weight: 600;
    font-size: 0.9rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.9rem 1rem;
    background: rgba(10, 15, 26, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 0.975rem;
    color: #ffffff;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
      color: #64748b;
    }

    &:focus {
      border-color: #ED145B;
      box-shadow: 0 0 15px rgba(237, 20, 91, 0.35);
    }
  }

  textarea {
    min-height: 220px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.95rem;
  background-color: #ED145B;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(237, 20, 91, 0.4);

  &:hover {
    background-color: #c40e48;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #475569;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

export const CreatePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState('');

  // 🟢 Carrega os dados do post quando estiver em modo de edição (/posts/edit/:id)
  useEffect(() => {
    if (isEditing && id) {
      setLoadingData(true);
      api.get(`/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title || '');
          setContent(res.data.content || '');
        })
        .catch((err) => {
          console.error('Erro ao carregar publicação para edição:', err);
          setError('Não foi possível buscar as informações desta publicação.');
        })
        .finally(() => setLoadingData(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        content,
        author: user?.email ? user.email.split('@')[0] : 'Docente FIAP',
        summary: content.slice(0, 100) + '...',
      };

      if (isEditing && id) {
        // Atualiza o post existente
        await api.put(`/posts/${id}`, payload);
      } else {
        // Cria novo post
        await api.post('/posts', payload);
      }

      navigate('/admin');
    } catch (err: any) {
      console.error('Erro ao salvar post:', err);
      setError(err.response?.data?.error || 'Erro ao salvar a postagem acadêmica.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Header />
        <Container style={{ textAlign: 'center', color: '#94a3b8', marginTop: '4rem' }}>
          Carregando publicação para edição...
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Link to="/admin" style={{ color: '#ff6b9d', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Voltar para o Painel
        </Link>

        <FormCard>
          <Title>{isEditing ? '✏️ Editar Postagem' : '➕ Criar Nova Postagem'}</Title>
          <Subtitle>
            {isEditing
              ? 'Edite abaixo os campos do artigo acadêmico'
              : 'Preencha o título e conteúdo para publicar na plataforma'}
          </Subtitle>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Título da Postagem:</label>
              <input
                type="text"
                placeholder="Ex: Introdução ao Arquiteturas de Microsserviços"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Conteúdo Completo:</label>
              <textarea
                placeholder="Escreva aqui o conteúdo..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading
                ? 'Salvando...'
                : isEditing
                ? 'Atualizar Postagem'
                : 'Publicar Postagem'}
            </SubmitButton>
          </form>
        </FormCard>
      </Container>
    </>
  );
};