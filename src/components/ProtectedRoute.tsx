import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { signed, user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  // Garante que o usuário precisa estar logado E ser professor (TEACHER)
  if (!signed || user?.role !== 'TEACHER') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};