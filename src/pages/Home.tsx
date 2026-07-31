import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

interface Post {
  id: string;
  title: string;
  author: string;
  summary: string;
}

const Hero = styled.section`
  background: linear-gradient(135deg, var(--fiap-black) 0%, var(--fiap-dark-gray) 100%);
  color: #fff;
  padding: 3.5rem 1.5rem;
  text-align: center;
  border-bottom: 2px solid var(--fiap-pink);
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  span {
    color: var(--fiap-pink);
  }
`;

const HeroSubtitle = styled.p`
  color: #a1a1aa;
  font-size: 1.1rem;
  max-width: 650px;
  margin: 0 auto 1.5rem auto;
`;

const Container = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  display: block;
  margin: 0 auto 2.5rem auto;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  font-size: 1rem;
  box-shadow: var(--shadow);
  outline: none;

  &:focus {
    border-color: var(--fiap-pink);
  }
`;

const PostGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`;

const Card = styled.article`
  background: var(--fiap-card-bg);
  border-radius: var(--radius);
  border-left: 4px solid var(--fiap-pink);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const AuthorBadge = styled.span`
  background: rgba(237, 20, 91, 0.1);
  color: var(--fiap-pink);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.75rem;
  width: fit-content;
`;

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get<Post[]>('/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <Hero>
        <HeroTitle>
          Blog <span>Tech Challenge</span>
        </HeroTitle>
        <HeroSubtitle>
          Plataforma de artigos e troca de conhecimento da Pós Tech FIAP em Full Stack Development
        </HeroSubtitle>
      </Hero>

      <Container>
        <SearchInput
          type="text"
          placeholder="🔍 Filtrar postagens por palavra-chave ou professor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Exibindo <strong>{filteredPosts.length}</strong> artigo(s)
        </p>

        <PostGrid>
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <div>
                <AuthorBadge>👨‍🏫 {post.author}</AuthorBadge>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{post.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                  {post.summary}
                </p>
              </div>
              <Link
                to={`/posts/${post.id}`}
                style={{ color: 'var(--fiap-pink)', fontWeight: 700, fontSize: '0.9rem' }}
              >
                Ler artigo completo →
              </Link>
            </Card>
          ))}
        </PostGrid>
      </Container>
    </>
  );
};