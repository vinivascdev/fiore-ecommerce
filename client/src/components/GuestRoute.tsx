import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-stone-500 text-sm">
        Carregando...
      </div>
    );
  }

  // Se o usuário já estiver logado, redireciona para a Home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Se não estiver logado, permite o acesso à tela de Login ou Cadastro
  return <>{children}</>;
};