import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

interface Comment {
  id: number | string;
  author?: string | { name?: string; email?: string };
  content?: string;
  text?: string;
  parentId?: number | string | null;
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

const CommentCard = styled.div<{ isReply?: boolean }>`
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid ${(props) => (props.isReply ? '#38bdf8' : '#ED145B')};
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  margin-left: ${(props) => (props.isReply ? '2.5rem' : '0')};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;

  strong {
    color: #ff6b9d;
    font-size: 0.875rem;
  }
`;

const CommentBody = styled.p`
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  button {
    background: transparent;
    border: none;
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .reply-btn {
    color: #38bdf8;
  }

  .delete-btn {
    color: #ef4444;
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
  const [replyingTo, setReplyingTo] = useState<number | string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Identifica perfil com privilégios de exclusão
  const isTeacherOrAdmin = user?.role === 'TEACHER' || user?.role === 'SUPERADMIN';

  const loadPost = async () => {
    if (!id) return;
    try {
      const res = await api.get<PostDetailData>(`/posts/${id}`);
      let commentsList = res.data.comments || [];

      try {
        const commentsRes = await api.get<Comment[]>(`/posts/${id}/comments`);
        if (Array.isArray(commentsRes.data)) {
          commentsList = commentsRes.data;
        }
      } catch {
        // Mantém comentários extraídos da postagem
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
      let rawToken =
        localStorage.getItem('token') ||
        localStorage.getItem('@Blog:token') ||
        localStorage.getItem('@App:token') ||
        '';

      rawToken = rawToken.replace(/^"|"$/g, '').trim();
      const tokenHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

      const config = {
        headers: {
          Authorization: tokenHeader,
        },
      };

      const payload = {
        content: newComment,
        text: newComment,
        postId: id,
        parentId: replyingTo || undefined,
        author: user?.email ? user.email.split('@')[0] : 'Docente/Aluno',
      };

      await api.post<Comment>(`/posts/${id}/comments`, payload, config);

      setNewComment('');
      setReplyingTo(null);
      await loadPost();
    } catch (err: any) {
      console.error('Erro ao enviar comentário:', err);
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Não foi possível enviar o comentário.';

      setError(backendError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number | string) => {
    if (!window.confirm('Tem certeza que deseja remover este comentário?')) return;

    try {
      let rawToken =
        localStorage.getItem('token') ||
        localStorage.getItem('@Blog:token') ||
        localStorage.getItem('@App:token') ||
        '';

      rawToken = rawToken.replace(/^"|"$/g, '').trim();
      const tokenHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

      await api.delete(`/posts/comments/${commentId}`, {
        headers: { Authorization: tokenHeader },
      });

      await loadPost();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao remover comentário.');
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

  // Organiza os comentários entre raízes e respostas
  const rootComments = post.comments?.filter((c) => !c.parentId) || [];
  const getReplies = (parentId: number | string) =>
    post.comments?.filter((c) => String(c.parentId) === String(parentId)) || [];

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
              {rootComments.length > 0 ? (
                rootComments.map((c) => {
                  const replies = getReplies(c.id);
                  const commentAuthor =
                    typeof c.author === 'object'
                      ? c.author?.name || c.author?.email
                      : c.author || 'Membro FIAP';

                  return (
                    <React.Fragment key={c.id}>
                      {/* Comentário Principal */}
                      <CommentCard>
                        <CommentHeader>
                          <strong>👤 {commentAuthor} escreveu:</strong>
                          <ActionButtons>
                            {signed && (
                              <button
                                className="reply-btn"
                                onClick={() => setReplyingTo(c.id)}
                              >
                                ↩️ Responder
                              </button>
                            )}
                            {isTeacherOrAdmin && (
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteComment(c.id)}
                              >
                                🗑️ Excluir
                              </button>
                            )}
                          </ActionButtons>
                        </CommentHeader>
                        <CommentBody>{c.content || c.text}</CommentBody>
                      </CommentCard>

                      {/* Respostas Aninhadas abaixo do Comentário do Aluno */}
                      {replies.map((reply) => {
                        const replyAuthor =
                          typeof reply.author === 'object'
                            ? reply.author?.name || reply.author?.email
                            : reply.author || 'Membro FIAP';

                        return (
                          <CommentCard key={reply.id} isReply>
                            <CommentHeader>
                              <strong>💬 Resposta de {replyAuthor}:</strong>
                              <ActionButtons>
                                {isTeacherOrAdmin && (
                                  <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteComment(reply.id)}
                                  >
                                    🗑️ Excluir
                                  </button>
                                )}
                              </ActionButtons>
                            </CommentHeader>
                            <CommentBody>{reply.content || reply.text}</CommentBody>
                          </CommentCard>
                        );
                      })}
                    </React.Fragment>
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
                {replyingTo && (
                  <div
                    style={{
                      color: '#38bdf8',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>↩️ Respondendo ao comentário #{replyingTo}</span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancelar resposta
                    </button>
                  </div>
                )}
                <Textarea
                  rows={4}
                  placeholder={
                    replyingTo
                      ? 'Escreva sua resposta para o aluno...'
                      : 'Deixe uma colaboração ou dúvida acadêmica...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <SubmitBtn type="submit" disabled={submitting || !newComment.trim()}>
                  {submitting
                    ? 'Enviando...'
                    : replyingTo
                    ? 'Enviar Resposta'
                    : 'Enviar Comentário'}
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