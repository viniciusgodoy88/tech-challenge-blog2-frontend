import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

interface UserItem {
  id: string;
  email: string;
  role: string;
}

const Container = styled.main`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ED145B;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #18181b;
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #27272a;
  }

  th {
    background: #27272a;
    color: #a1a1aa;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  background: ${(props) =>
    props.$role === 'SUPERADMIN'
      ? '#dc2626'
      : props.$role === 'TEACHER'
      ? '#0284c7'
      : '#52525b'};
  color: #fff;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  background: ${(props) => (props.$danger ? '#dc2626' : '#ED145B')};
  color: #fff;
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        setLoading(true);
        // Tenta buscar na rota /auth/users e se falhar tenta /users
        let response;
        try {
          response = await api.get('/auth/users');
        } catch {
          response = await api.get('/users');
        }

        if (isMounted && response.data) {
          setUsersList(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        if (isMounted) setMessage("Erro ao carregar lista de usuários.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (user?.role === 'SUPERADMIN') {
      fetchUsers();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.role]); // Executa apenas quando o perfil for validado

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'TEACHER' ? 'STUDENT' : 'TEACHER';
    try {
      await api.patch(`/auth/users/${userId}/role`, { role: nextRole });
      setMessage(`Papel atualizado com sucesso para ${nextRole}!`);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch {
      setMessage("Falha ao alterar papel do usuário.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      setMessage("Usuário removido com sucesso!");
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setMessage("Falha ao remover usuário.");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Title>Painel da Intranet</Title>

        {message && (
          <div style={{ padding: '0.75rem 1rem', background: '#27272a', borderRadius: '6px', marginBottom: '1rem', borderLeft: '4px solid #ED145B' }}>
            {message}
          </div>
        )}

        {user?.role === 'SUPERADMIN' ? (
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gestão de Usuários (SuperAdmin)</h2>
            {loading ? (
              <p>Carregando usuários do sistema...</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Papel (Role)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>
                        <RoleBadge $role={u.role}>{u.role}</RoleBadge>
                      </td>
                      <td>
                        {u.role !== 'SUPERADMIN' && (
                          <>
                            <ActionButton onClick={() => handleToggleRole(u.id, u.role)}>
                              Tornar {u.role === 'TEACHER' ? 'Aluno' : 'Professor'}
                            </ActionButton>
                            <ActionButton $danger onClick={() => handleDeleteUser(u.id)}>
                              Excluir
                            </ActionButton>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>
        ) : (
          <div>
            <p>Bem-vindo à Intranet!</p>
            <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>
              Utilize os botões superiores para navegar ou publicar novos conteúdos.
            </p>
          </div>
        )}
      </Container>
    </>
  );
};