import React, { createContext, useContext, useState, useEffect } from 'react';

export type TipoUsuario = 'CLIENTE' | 'ADMIN';

export interface UserSession {
  id_usuario: number;
  nome: string;
  email: string;
  login: string;
  tipo_usuario: TipoUsuario;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (loginInput: string, senhaInput: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Revalida a sessão no backend ao carregar ou atualizar a página (F5)
  useEffect(() => {
    fetch('http://localhost:3333/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginInput: string, senhaInput: string) => {
    const response = await fetch('http://localhost:3333/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginInput, senha: senhaInput }),
      credentials: 'include', // Envia e recebe cookies HTTP-only
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao realizar login.');
    }

    setUser(data.user);
  };

  const logout = async () => {
    await fetch('http://localhost:3333/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);