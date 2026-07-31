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

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background: #fff;

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
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c40e48;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
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

const Message = styled.div<{ $type: 'error' | 'success' }>`
  background-color: ${(props) => (props.$type === 'error' ? '#fee2e2' : '#dcfce7')};
  color: ${(props) => (props.$type === 'error' ? '#dc2626' : '#15803d')};
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  text-align: center;
`;

export const Register: React.FC = () => {
  const { signed, user } = useAuth();
  
  // Apenas o Admin Geral (TEACHER autenticado) tem permissão de escolher a role
  const isAdmin = signed && user?.role === 'TEACHER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Padrão é STUDENT. Se for Admin, inicia liberado para escolha.
  const [role, setRole] = useState<'TEACHER' | 'STUDENT'>('STUDENT');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Garante que se NÃO for admin, a role obrigatoriamente será STUDENT
    const finalRole = isAdmin ? role : 'STUDENT';

    try {
      await api.post('/auth/register', {
        name,
        email,
        pass: password,
        password: password,
        role: finalRole,
      });

      setMessage({ text: 'Conta criada com sucesso! Redirecionando...', type: 'success' });

      setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/login');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      setMessage({
        text: err.response?.data?.error || 'Erro ao realizar cadastro.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        <Title>Criar Conta</Title>
        <Subtitle>
          {isAdmin ? 'Painel de Cadastro de Usuários (Admin)' : 'Cadastre-se para comentar e interagir'}
        </Subtitle>

        {message && <Message $type={message.type}>{message.text}</Message>}

        <form onSubmit={handleRegister}>
          <FormGroup>
            <label>Nome Completo:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </FormGroup>

          <FormGroup>
            <label>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@fiap.com.br"
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

          {/* Renderização Condicional: APENAS O ADMIN PODE ESCOLHER A ROLE */}
          {isAdmin && (
            <FormGroup>
              <label>Perfil de Acesso (Exclusivo Admin):</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'TEACHER' | 'STUDENT')}>
                <option value="STUDENT">Discente (Aluno)</option>
                <option value="TEACHER">Docente (Professor / Admin)</option>
              </select>
            </FormGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Conta'}
          </SubmitButton>
        </form>

        <LoginLink>
          <Link to="/login">Já tem uma conta? Faça login aqui</Link>
        </LoginLink>
      </Content>
    </Container>
  );
};

export default Register;