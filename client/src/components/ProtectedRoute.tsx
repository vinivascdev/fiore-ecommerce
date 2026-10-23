import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, TipoUsuario } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: TipoUsuario;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-900 text-stone-200">
        Carregando sessão...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.tipo_usuario !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};