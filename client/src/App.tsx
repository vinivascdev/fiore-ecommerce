import React from 'react'; 
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Componente Header com botões de Login/Logout e status da sessão
function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="w-full max-w-4xl flex items-center justify-between py-4 px-6 bg-white/70 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm mb-6">
      <Link to="/" className="text-xl font-serif font-bold text-stone-900 tracking-tight">
        Fiore
      </Link>
      
      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <span className="text-stone-600">
              Olá, <strong className="text-stone-900 font-medium">{user.nome}</strong> ({user.tipo_usuario})
            </span>
            {user.tipo_usuario === 'ADMIN' && (
              <Link to="/admin" className="text-amber-700 hover:text-amber-800 font-semibold underline">
                Painel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/cadastro"
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 border border-amber-300 rounded-lg transition"
            >
              Cadastrar
            </Link>
            <Link
              to="/login"
              className="px-4 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/60 hover:bg-amber-200 rounded-lg transition"
            >
              Entrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

// Home demonstrativa
function HomePage() {
  return (
    <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-100 text-center">
      <span className="text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full">
        Haute Parfumerie
      </span>
      <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4 tracking-tight">
        Fiore
      </h1>
      <p className="text-stone-600 mt-2 text-sm leading-relaxed">
        Estrutura base do frontend pronta para desenvolvimento com React, TypeScript e Tailwind CSS.
      </p>
      <div className="mt-6 pt-6 border-t border-stone-100 text-xs text-stone-400">
        API Backend: <span className="font-mono text-stone-600">http://localhost:3333</span>
      </div>
    </div>
  );
}

// Área Protegida de Teste para Clientes
function ClientePage() {
  const { user } = useAuth();
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200 text-center">
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Área do Cliente</h2>
      <p className="text-sm text-stone-600">Bem-vindo(a), {user?.nome}!</p>
    </div>
  );
}

// Área Protegida de Teste para Administradores
function AdminPage() {
  return (
    <div className="max-w-md w-full bg-amber-950 text-amber-50 p-8 rounded-2xl shadow-xl border border-amber-800 text-center">
      <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 bg-amber-900/60 px-3 py-1 rounded-full">
        Acesso Restrito
      </span>
      <h2 className="text-2xl font-serif font-bold mt-4 mb-2 text-amber-200">Painel do Administrador</h2>
      <p className="text-sm text-amber-300/80">Gestão de catálogo e pedidos do e-commerce Fiore.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Rotas restritas para visitantes (redirecionam para '/' se já estiver logado) */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            {/* Rota Protegida Exclusiva para Cliente */}
            <Route
              path="/minha-conta"
              element={
                <ProtectedRoute allowedRole="CLIENTE">
                  <ClientePage />
                </ProtectedRoute>
              }
            />

            {/* Rota Protegida Exclusiva para Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}