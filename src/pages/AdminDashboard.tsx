import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

interface Post {
  id: string;
  title: string;
  author?: string;
}

interface UserItem {
  id: string;
  email: string;
  role: string;
}

const Container = styled.main`
  max-width: 1050px;
  margin: 3rem auto;
  padding: 0 1.5rem 4rem;
  color: #f8fafc;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.75rem;
    color: #ffffff !important;
    font-weight: 800;
  }

  p {
    color: #94a3b8 !important;
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

/* 🔴 Card Glassmorphism Escuro com Texto de Alta Visibilidade */
const CardForm = styled.div`
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  h3 {
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
    color: #ffffff !important;
    font-weight: 700;
  }
`;

const FormRow = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  .field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0 !important;
    }

    input, select {
      padding: 0.7rem 0.9rem;
      background: rgba(10, 15, 26, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      font-size: 0.95rem;
      color: #ffffff !important;
      outline: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: #64748b;
      }

      &:focus {
        border-color: #ED145B;
        box-shadow: 0 0 12px rgba(237, 20, 91, 0.3);
      }

      option {
        background: #18181b;
        color: #ffffff;
      }
    }
  }
`;

/* 🔴 Tabela Dark com Contraste Total nos E-mails e Textos */
const TableCard = styled.div`
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  th {
    background: rgba(237, 20, 91, 0.12);
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #ff6b9d !important;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  /* 🔴 Força a visibilidade perfeita de todos os e-mails e títulos */
  td {
    color: #f8fafc !important;
    font-size: 0.95rem;

    strong, span, p {
      color: #ffffff !important;
    }
  }
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: ${(props) => (props.$danger ? 'rgba(220, 38, 38, 0.2)' : 'rgba(2, 132, 199, 0.2)')};
  color: ${(props) => (props.$danger ? '#fca5a5' : '#7dd3fc')} !important;
  border: 1px solid ${(props) => (props.$danger ? 'rgba(220, 38, 38, 0.4)' : 'rgba(2, 132, 199, 0.4)')};
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.825rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$danger ? '#dc2626' : '#0284c7')};
    color: #ffffff !important;
  }
`;

const PrimaryBtn = styled.button`
  background: #ED145B;
  color: #fff !important;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  height: 44px;
  box-shadow: 0 4px 15px rgba(237, 20, 91, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: #c40e48;
    transform: translateY(-1px);
  }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  background: ${(props) => {
    const r = (props.$role || '').toUpperCase();
    if (r === 'SUPERADMIN') return '#dc2626';
    if (r === 'TEACHER') return '#0284c7';
    return '#475569';
  }};
  color: #fff !important;
`;

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Estados do Novo Cadastro
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('STUDENT');
  const [defaultPassword, setDefaultPassword] = useState('mudar123');

  const isSuperAdmin = user?.role?.toUpperCase() === 'SUPERADMIN';

  const loadPosts = () => {
    api
      .get<Post[]>('/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      let response;
      try {
        response = await api.get('/auth/users');
      } catch {
        response = await api.get('/users');
      }
      setUsersList(Array.isArray(response.data) ? response.data : []);
    } catch {
      console.error('Erro ao buscar usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadPosts();
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  // Cadastrar Novo Usuário pelo Painel
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      const res = await api.post('/auth/users', {
        email: newEmail,
        role: newRole,
        password: defaultPassword,
      });

      setMessage(res.data.message || 'Usuário cadastrado com sucesso!');
      setNewEmail('');
      loadUsers();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Erro ao cadastrar usuário.';
      setMessage(errMsg);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const rUpper = (currentRole || '').toUpperCase();
    const nextRole = rUpper === 'TEACHER' ? 'STUDENT' : 'TEACHER';

    try {
      await api.patch(`/auth/users/${userId}/role`, { role: nextRole });
      setMessage(`Papel alterado para ${nextRole} com sucesso!`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch {
      setMessage('Falha ao alterar papel do usuário.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        setMessage('Usuário removido com sucesso!');
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
      } catch {
        setMessage('Falha ao remover usuário.');
      }
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta postagem permanentemente?')) {
      await api.delete(`/posts/${id}`);
      setMessage('Postagem excluída!');
      loadPosts();
    }
  };

  return (
    <>
      <Header />
      <Container>
        {message && (
          <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fef08a', borderRadius: '8px', marginBottom: '1.75rem', borderLeft: '4px solid #f59e0b', fontSize: '0.925rem' }}>
            {message}
          </div>
        )}

        {/* ==============================================================================
            SESSÃO SUPERADMIN: CADASTRAR E GERENCIAR USUÁRIOS
           ============================================================================== */}
        {isSuperAdmin && (
          <section style={{ marginBottom: '3.5rem' }}>
            <AdminHeader>
              <div>
                <h1>Gestão de Usuários</h1>
                <p>Cadastre novos usuários e defina papéis no sistema</p>
              </div>
            </AdminHeader>

            {/* FORMULÁRIO DE NOVO CADASTRO */}
            <CardForm>
              <h3>➕ Cadastrar Novo Usuário</h3>
              <FormRow onSubmit={handleCreateUser}>
                <div className="field">
                  <label>E-mail do Usuário:</label>
                  <input
                    type="email"
                    placeholder="exemplo@fiap.com.br"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Papel (Role):</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="STUDENT">Aluno (Student)</option>
                    <option value="TEACHER">Professor (Teacher)</option>
                  </select>
                </div>

                <div className="field">
                  <label>Senha Inicial Padrão:</label>
                  <input
                    type="text"
                    value={defaultPassword}
                    onChange={(e) => setDefaultPassword(e.target.value)}
                    required
                  />
                </div>

                <PrimaryBtn type="submit">Cadastrar Usuário</PrimaryBtn>
              </FormRow>
            </CardForm>

            {/* TABELA DE USUÁRIOS */}
            <TableCard>
              {loadingUsers ? (
                <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Carregando usuários...</p>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>E-mail</th>
                      <th>Papel Atual</th>
                      <th>Ações Administrativas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => {
                      const uRoleUpper = (u.role || '').toUpperCase();
                      return (
                        <tr key={u.id}>
                          <td style={{ fontWeight: 600 }}>{u.email}</td>
                          <td>
                            <RoleBadge $role={u.role}>{u.role}</RoleBadge>
                          </td>
                          <td>
                            {uRoleUpper !== 'SUPERADMIN' && (
                              <>
                                <ActionBtn onClick={() => handleToggleRole(u.id, u.role)}>
                                  Tornar {uRoleUpper === 'TEACHER' ? 'Aluno' : 'Professor'}
                                </ActionBtn>
                                <ActionBtn $danger onClick={() => handleDeleteUser(u.id)}>
                                  Excluir
                                </ActionBtn>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </TableCard>
          </section>
        )}

        {/* ==============================================================================
            SESSÃO DOCENTE: GESTÃO DE POSTAGENS ACADÊMICAS
           ============================================================================== */}
        <section>
          <AdminHeader>
            <div>
              <h1>Painel de Gestão Docente</h1>
              <p>Gerencie suas postagens acadêmicas criadas</p>
            </div>
            <Link to="/posts/new">
              <button style={{ background: '#10b981', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                + Nova Postagem
              </button>
            </Link>
          </AdminHeader>

          <TableCard>
            <Table>
              <thead>
                <tr>
                  <th>Título do Post</th>
                  <th>Autor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 600 }}>{post.title}</td>
                    <td>{post.author || 'Docente FIAP'}</td>
                    <td>
                      <Link to={`/posts/edit/${post.id}`}>
                        <ActionBtn>Editar</ActionBtn>
                      </Link>
                      <ActionBtn $danger onClick={() => handleDeletePost(post.id)}>
                        Excluir
                      </ActionBtn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableCard>
        </section>
      </Container>
    </>
  );
};