import React, { createContext, useContext, useState, useEffect } from 'react';

export type TipoUsuario = 'CLIENTE' | 'ADMIN';

export interface UserSession {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<UserSession>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email: string, senha: string): Promise<UserSession> => {
    try {
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'E-mail ou senha inválidos.');
      }

      setUser(data.user);
      return data.user;
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      throw err;
    }
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