import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { Header } from '../components/Header';

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface PostDetailData {
  id: string;
  title: string;
  author: string;
  content: string;
  comments?: Comment[];
}

const Wrapper = styled.article`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1.5rem;
`;

const ArticleCard = styled.div`
  background: var(--bg-card);
  padding: 2.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-main);
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const BodyText = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #334155;
  white-space: pre-line;
  margin-bottom: 3rem;
`;

const CommentSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
`;

const CommentItem = styled.div`
  background: #f1f5f9;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  strong {
    color: var(--primary);
    display: block;
    margin-bottom: 0.25rem;
  }
`;

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      api
        .get<PostDetailData>(`/posts/${id}`)
        .then((res) => setPost(res.data))
        .catch(() => setPost(null));
    }
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    try {
      const res = await api.post<Comment>(`/posts/${id}/comments`, { content: newComment });
      setPost((prev) => (prev ? { ...prev, comments: [...(prev.comments || []), res.data] } : prev));
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!post)
    return (
      <>
        <Header />
        <Wrapper style={{ textAlign: 'center' }}>Carregando postagem acadêmica...</Wrapper>
      </>
    );

  return (
    <>
      <Header />
      <Wrapper>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Voltar para a lista de posts
        </Link>
        <ArticleCard>
          <Title>{post.title}</Title>
          <MetaInfo>
            <span>✍️ Autor: <strong>{post.author}</strong></span>
          </MetaInfo>
          <BodyText>{post.content}</BodyText>

          <CommentSection>
            <h3>💬 Comentários Acadêmicos ({post.comments?.length || 0})</h3>
            <div style={{ margin: '1.5rem 0' }}>
              {post.comments?.map((c) => (
                <CommentItem key={c.id}>
                  <strong>{c.author} escreveu:</strong>
                  <p>{c.content}</p>
                </CommentItem>
              ))}
            </div>

            <form onSubmit={handleAddComment}>
              <textarea
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  marginBottom: '0.75rem',
                }}
                placeholder="Deixe uma colaboração ou dúvida acadêmica..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Enviar Comentário
              </button>
            </form>
          </CommentSection>
        </ArticleCard>
      </Wrapper>
    </>
  );
};