import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

interface Post {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
}

// Container principal com Imagem de Fundo Tecnológica + Overlay Escuro
const MainWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
      rgba(13, 13, 17, 0.88), 
      rgba(13, 13, 17, 0.95)
    ),
    url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop') 
    center/cover no-repeat fixed;
`;

const Hero = styled.section`
  color: #ffffff;
  padding: 4rem 1.5rem 3rem;
  text-align: center;
  border-bottom: 1px solid rgba(237, 20, 91, 0.3);
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(135deg, #ED145B 0%, #ff6b9d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Container = styled.main`
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem 4rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 650px;
  display: block;
  margin: 0 auto 2.5rem auto;
  padding: 1.1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(12px);
  color: #ffffff;
  font-size: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #ED145B;
    box-shadow: 0 0 20px rgba(237, 20, 91, 0.3);
    background: rgba(24, 24, 27, 0.95);
  }
`;

const PostGrid = styled.div`
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
`;

const Card = styled.article`
  background: rgba(24, 24, 27, 0.82);
  backdrop-filter: blur(16px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 4px solid #ED145B;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(237, 20, 91, 0.2);
    border-color: rgba(237, 20, 91, 0.5);
  }
`;

const AuthorBadge = styled.span`
  background: rgba(237, 20, 91, 0.15);
  color: #ff6b9d;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 0.85rem;
  border: 1px solid rgba(237, 20, 91, 0.3);
  width: fit-content;
`;

const ReadMoreLink = styled(Link)`
  color: #ED145B;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    gap: 10px;
    color: #ff6b9d;
  }
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

  const filteredPosts = posts.filter((p) => {
    const term = search.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(term);
    const authorMatch = (p.author || 'Docente FIAP').toLowerCase().includes(term);
    const contentMatch = (p.content || p.summary || '').toLowerCase().includes(term);

    return titleMatch || authorMatch || contentMatch;
  });

  return (
    <MainWrapper>
      <Header />
      <Hero>
        <HeroTitle>
          Blog <span>Blogging - Tech Challenge 3 - FSDT</span>
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

        <p style={{ marginBottom: '1.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
          Exibindo <strong style={{ color: '#ffffff' }}>{filteredPosts.length}</strong> artigo(s)
        </p>

        <PostGrid>
          {filteredPosts.map((post) => {
            const displaySummary =
              post.summary || (post.content ? `${post.content.slice(0, 120)}...` : 'Sem conteúdo disponível.');
            const displayAuthor = post.author || 'Docente FIAP';

            return (
              <Card key={post.id}>
                <div>
                  <AuthorBadge>👨‍🏫 {displayAuthor}</AuthorBadge>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.65rem', color: '#f8fafc', fontWeight: 700 }}>
                    {post.title}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.6' }}>
                    {displaySummary}
                  </p>
                </div>
                <ReadMoreLink to={`/posts/${post.id}`}>
                  Ler artigo completo →
                </ReadMoreLink>
              </Card>
            );
          })}
        </PostGrid>
      </Container>
    </MainWrapper>
  );
};