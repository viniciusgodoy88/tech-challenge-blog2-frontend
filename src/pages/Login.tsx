import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/Header';

// Fundo com Imagem de Tecnologia (Dark Code / Cyber) + Overlay
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
      rgba(10, 10, 14, 0.85), 
      rgba(10, 10, 14, 0.92)
    ),
    url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop') 
    center/cover no-repeat fixed;
`;

const Content = styled.div`
  max-width: 440px;
  width: 90%;
  margin: 4.5rem auto;
  padding: 2.75rem 2.25rem;
  background: rgba(18, 18, 22, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(237, 20, 91, 0.2);
  border-top: 5px solid #ED145B;
`;

const Title = styled.h2`
  text-align: center;
  color: #ffffff;
  margin-bottom: 0.4rem;
  font-size: 1.85rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2.25rem;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #e2e8f0;
    font-weight: 600;
    font-size: 0.875rem;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    background: rgba(10, 15, 26, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 0.975rem;
    color: #ffffff;
    transition: all 0.2s ease;

    &::placeholder {
      color: #64748b;
    }

    &:focus {
      outline: none;
      border-color: #ED145B;
      box-shadow: 0 0 15px rgba(237, 20, 91, 0.35);
      background: rgba(10, 15, 26, 0.9);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.95rem;
  background-color: #ED145B;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(237, 20, 91, 0.4);

  &:hover {
    background-color: #c40e48;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(237, 20, 91, 0.6);
  }

  &:disabled {
    background-color: #475569;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.75rem;

  a {
    color: #ff6b9d;
    font-weight: 600;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.5);
  color: #fca5a5;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
`;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (signed) {
      navigate('/admin', { replace: true });
    }
  }, [signed, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        pass: password,
        password: password,
      });

      const token = response.data.token || response.data.accessToken;
      const apiUser = response.data.user || response.data.userData;
      const isSuperUserEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('super');

      const user = apiUser || {
        id: 'usr_01',
        email: email,
        role: isSuperUserEmail ? 'SUPERADMIN' : 'TEACHER',
      };

      if (!token) {
        throw new Error('Token não retornado pela API');
      }

      login(token, user);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'E-mail ou senha incorretos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        <Title>Intranet</Title>
        <Subtitle>Acesse com seu e-mail e senha</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite aqui seu e-mail"
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </SubmitButton>
        </form>

        <RegisterLink>
          <Link to="/register">Ainda não tem conta? Cadastre-se aqui</Link>
        </RegisterLink>
      </Content>
    </Container>
  );
};