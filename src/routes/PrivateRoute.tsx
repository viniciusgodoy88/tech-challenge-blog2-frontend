import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { signed, user, loading } = useAuth();

  // Enquanto valida a sessão no localStorage, aguarda a resposta
  if (loading) {
    return <div style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>Carregando sessão...</div>;
  }

  // Se não estiver autenticado, redireciona para a tela de login
  if (!signed || !user) {
    return <Navigate to="/login" replace />;
  }

  // Se houver restrição por papéis (roles), valida a permissão do usuário
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role ? user.role.toUpperCase() : '';
    const hasPermission = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

    if (!hasPermission) {
      // Se não tiver a permissão necessária, redireciona para a página inicial
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};