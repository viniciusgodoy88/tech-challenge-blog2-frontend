import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../services/api';
import { Header } from '../components/Header';

interface Post {
  id: string;
  title: string;
  author: string;
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
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TableCard = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  th {
    background: #f8fafc;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: var(--text-muted);
  }
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: ${(props) => (props.$danger ? '#fee2e2' : '#e0f2fe')};
  color: ${(props) => (props.$danger ? 'var(--danger)' : 'var(--primary)')};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.825rem;
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

export const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = () => {
    api
      .get<Post[]>('/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta postagem permanentemente?')) {
      await api.delete(`/posts/${id}`);
      loadPosts();
    }
  };

  return (
    <>
      <Header />
      <Container>
        <AdminHeader>
          <div>
            <h1>Painel de Gestão Docente</h1>
            <p style={{ color: 'var(--text-muted)' }}>Gerencie suas postagens acadêmicas criadas</p>
          </div>
          <Link to="/posts/new">
            <button style={{ background: 'var(--success)', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}>
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
                  <td>{post.author}</td>
                  <td>
                    <Link to={`/posts/edit/${post.id}`}>
                      <ActionBtn>Editar</ActionBtn>
                    </Link>
                    <ActionBtn $danger onClick={() => handleDelete(post.id)}>
                      Excluir
                    </ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </Container>
    </>
  );
};