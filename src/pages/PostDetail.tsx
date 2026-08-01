import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

interface Comment {
  id?: string;
  author?: string | { name?: string; email?: string };
  content?: string;
  text?: string;
}

interface PostDetailData {
  id: string;
  title: string;
  author?: string;
  content: string;
  comments?: Comment[];
}

const Wrapper = styled.article`
  max-width: 850px;
  margin: 3rem auto;
  padding: 0 1.5rem 4rem;
`;

const ArticleCard = styled.div`
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(16px);
  padding: 2.5rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ff6b9d;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BodyText = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #cbd5e1;
  white-space: pre-line;
  margin-bottom: 3rem;
`;

const CommentSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: #ffffff;
    font-size: 1.35rem;
    margin-bottom: 1.5rem;
  }
`;

const CommentItem = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #ED145B;
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;

  strong {
    color: #ff6b9d;
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.875rem;
  }

  p {
    color: #e2e8f0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 1rem;
  background: rgba(10, 15, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.975rem;
  margin-bottom: 0.85rem;
  outline: none;
  resize: vertical;
  transition: all 0.2s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #ED145B;
    box-shadow: 0 0 15px rgba(237, 20, 91, 0.3);
  }
`;

const SubmitBtn = styled.button`
  background: #ED145B;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(237, 20, 91, 0.3);

  &:hover {
    background: #c40e48;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #475569;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { signed, user } = useAuth();

  const [post, setPost] = useState<PostDetailData | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadPost = async () => {
    if (!id) return;
    try {
      const res = await api.get<PostDetailData>(`/posts/${id}`);
      let commentsList = res.data.comments || [];

      // Tenta buscar comentários por rota dedicada caso o post venha sem array
      try {
        const commentsRes = await api.get<Comment[]>(`/posts/${id}/comments`);
        if (Array.isArray(commentsRes.data)) {
          commentsList = commentsRes.data;
        }
      } catch {
        // Mantém commentsList extraído do post
      }

      setPost({ ...res.data, comments: commentsList });
    } catch (err) {
      console.error('Erro ao buscar o post:', err);
      setPost(null);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        content: newComment,
        text: newComment,
        postId: id,
        author: user?.email ? user.email.split('@')[0] : 'Docente/Aluno',
      };

      let createdComment: Comment;

      try {
        const res = await api.post<Comment>(`/posts/${id}/comments`, payload);
        createdComment = res.data;
      } catch {
        const resAlt = await api.post<Comment>('/comments', payload);
        createdComment = resAlt.data;
      }

      // Atualização imediata em tela do novo comentário
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [
                ...(prev.comments || []),
                createdComment || {
                  id: String(Date.now()),
                  author: user?.email ? user.email.split('@')[0] : 'Docente/Aluno',
                  content: newComment,
                },
              ],
            }
          : prev
      );

      setNewComment('');
    } catch (err: any) {
      console.error('Erro ao enviar comentário:', err);
      setError('Não foi possível enviar o comentário. Verifique se está autenticado.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!post)
    return (
      <>
        <Header />
        <Wrapper style={{ textAlign: 'center', color: '#94a3b8', marginTop: '4rem' }}>
          Carregando postagem acadêmica...
        </Wrapper>
      </>
    );

  return (
    <>
      <Header />
      <Wrapper>
        <Link
          to="/"
          style={{
            color: '#ff6b9d',
            fontWeight: 600,
            display: 'inline-block',
            marginBottom: '1.5rem',
            textDecoration: 'none',
          }}
        >
          ← Voltar para a lista de posts
        </Link>
        <ArticleCard>
          <Title>{post.title}</Title>
          <MetaInfo>
            <span>
              ✍️ Autor: <strong>{post.author || 'Docente FIAP'}</strong>
            </span>
          </MetaInfo>
          <BodyText>{post.content}</BodyText>

          <CommentSection>
            <h3>💬 Comentários Acadêmicos ({post.comments?.length || 0})</h3>

            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.4)',
                  color: '#fca5a5',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ margin: '1.5rem 0' }}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((c, index) => {
                  const commentText = c.content || c.text || 'Sem texto';
                  const commentAuthor =
                    typeof c.author === 'object'
                      ? c.author?.name || c.author?.email
                      : c.author || 'Membro FIAP';

                  return (
                    <CommentItem key={c.id || index}>
                      <strong>👤 {commentAuthor} escreveu:</strong>
                      <p>{commentText}</p>
                    </CommentItem>
                  );
                })
              ) : (
                <p style={{ color: '#64748b', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  Nenhum comentário acadêmico registrado ainda. Seja o primeiro a colaborar!
                </p>
              )}
            </div>

            {signed ? (
              <form onSubmit={handleAddComment}>
                <Textarea
                  rows={4}
                  placeholder="Deixe uma colaboração ou dúvida acadêmica..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <SubmitBtn type="submit" disabled={submitting || !newComment.trim()}>
                  {submitting ? 'Enviando...' : 'Enviar Comentário'}
                </SubmitBtn>
              </form>
            ) : (
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                }}
              >
                Para enviar um comentário, acesse com sua conta na{' '}
                <Link to="/login" style={{ color: '#ED145B', fontWeight: 700 }}>
                  Intranet
                </Link>
                .
              </div>
            )}
          </CommentSection>
        </ArticleCard>
      </Wrapper>
    </>
  );
};