import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { signed, user, loading } = useAuth();

  // 1. Aguarda a leitura inicial do localStorage/Contexto antes de tomar qualquer decisão
  if (loading) {
    return (
      <div style={{ color: '#fff', padding: '4rem', textAlign: 'center', background: '#0d0d0d', minHeight: '100vh' }}>
        Validando sessão...
      </div>
    );
  }

  // 2. Se não estiver autenticado (sem token/user), manda para o Login
  if (!signed && !localStorage.getItem('token') && !localStorage.getItem('@Blog:token')) {
    return <Navigate to="/login" replace />;
  }

  // 3. Validação de papéis (RBAC) com suporte a Case-Insensitive
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = (user.role || '').toUpperCase();
    const hasRole = allowedRoles.some((role) => role.toUpperCase() === userRole);

    if (!hasRole) {
      // Se não tiver o papel necessário, manda para a Home ao invés de deslogar
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};