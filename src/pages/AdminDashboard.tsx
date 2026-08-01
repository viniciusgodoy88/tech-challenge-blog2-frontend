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
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 1.5rem;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CardForm = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
    gap: 0.4rem;

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }

    input, select {
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.95rem;
      outline: none;

      &:focus {
        border-color: #ED145B;
      }
    }
  }
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #64748b;
  }
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: ${(props) => (props.$danger ? '#fee2e2' : '#e0f2fe')};
  color: ${(props) => (props.$danger ? '#dc2626' : '#0284c7')};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 0.825rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const PrimaryBtn = styled.button`
  background: #ED145B;
  color: #fff;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  height: 42px;

  &:hover {
    background: #c40e48;
  }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
  background: ${(props) => {
    const r = (props.$role || '').toUpperCase();
    if (r === 'SUPERADMIN') return '#dc2626';
    if (r === 'TEACHER') return '#0284c7';
    return '#6b7280';
  }};
  color: #fff;
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
          <div style={{ padding: '0.75rem 1rem', background: '#fef3c7', color: '#92400e', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            {message}
          </div>
        )}

        {/* ==============================================================================
            SESSÃO SUPERADMIN: CADASTRAR E GERENCIAR USUÁRIOS
           ============================================================================== */}
        {isSuperAdmin && (
          <section style={{ marginBottom: '3rem' }}>
            <AdminHeader>
              <div>
                <h1 style={{ fontSize: '1.75rem', color: '#1a1a1a' }}>Gestão de Usuários</h1>
                <p style={{ color: '#666' }}>Cadastre novos usuários e defina papéis no sistema</p>
              </div>
            </AdminHeader>

            {/* FORMULÁRIO DE NOVO CADASTRO */}
            <CardForm>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0f172a' }}>➕ Cadastrar Novo Usuário</h3>
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
                <p style={{ padding: '1.5rem', textAlign: 'center' }}>Carregando usuários...</p>
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
              <h1 style={{ fontSize: '1.75rem', color: '#1a1a1a' }}>Painel de Gestão Docente</h1>
              <p style={{ color: '#666' }}>Gerencie suas postagens acadêmicas criadas</p>
            </div>
            <Link to="/posts/new">
              <button style={{ background: '#10b981', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
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