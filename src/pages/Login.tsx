import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/Header';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Content = styled.div`
  max-width: 450px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #ED145B;
`;

const Title = styled.h2`
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #ED145B;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  background-color: #ED145B;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #c40e48;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;

  a {
    color: #ED145B;
    font-weight: 600;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  text-align: center;
`;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Envia tanto 'pass' quanto 'password' para garantir compatibilidade com a rota do backend
      const response = await api.post('/auth/login', {
        email,
        pass: password,
        password: password,
      });

      const token = response.data.token || response.data.accessToken;
      const user = response.data.user || response.data.userData || {
        id: 'usr_01',
        name: 'Professor Pós Tech',
        email: email,
        role: 'TEACHER'
      };

      if (!token) {
        throw new Error('Token não retornado pela API');
      }

      login(token, user);
      navigate('/admin');
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
        <Title>Área do Docente</Title>
        <Subtitle>Acesse com seu e-mail e senha</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="professorpostech@fiap.com.br"
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