import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.header`
  background: #0d0d0d;
  border-bottom: 3px solid #ED145B;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 42px;
    object-fit: contain;
  }

  .badge-sub {
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-left: 2px solid #ED145B;
    padding-left: 0.75rem;

    span {
      color: #ED145B;
      display: block;
      font-size: 0.65rem;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Button = styled.button<{ $variant?: 'outline' | 'primary' | 'danger' }>`
  padding: 0.55rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$variant === 'primary'
      ? '#ED145B'
      : props.$variant === 'danger'
      ? '#dc2626'
      : 'transparent'};
  color: #ffffff;
  border: ${(props) =>
    props.$variant === 'outline' ? '1px solid #ED145B' : 'none'};

  &:hover {
    background: ${(props) =>
      props.$variant === 'primary'
        ? '#c40e48'
        : props.$variant === 'outline'
        ? 'rgba(237, 20, 91, 0.15)'
        : '#b91c1c'};
    transform: translateY(-1px);
  }
`;

export const Header: React.FC = () => {
  const { signed, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Nav>
      <NavContainer>
        <LogoLink to="/">
          <img
            src="https://s3.sa-east-1.amazonaws.com/remotar-assets-prod/company-logo/d8f07be8-a006-4076-a05e-eeed0ddcfc6f.png"
            alt="Logo FIAP"
          />
          <div className="badge-sub">
            PÓS TECH
            <span>Full Stack Development</span>
          </div>
        </LogoLink>

        <NavActions>
          <Link to="/">
            <Button $variant="outline">Início</Button>
          </Link>
          {signed ? (
            <>
              <Link to="/admin">
                <Button $variant="outline">Painel Admin</Button>
              </Link>
              <Link to="/posts/new">
                <Button $variant="primary">+ Criar Post</Button>
              </Link>
              <Button
                $variant="danger"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sair ({user?.name || 'Docente'})
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button $variant="primary">Área do Professor</Button>
            </Link>
          )}
        </NavActions>
      </NavContainer>
    </Nav>
  );
};