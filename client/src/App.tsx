// import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './components/Header';

// Home demonstrativa
function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50/50 via-stone-50 to-pink-50/30">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#D80075] bg-[#FFF0F7] px-3 py-1 rounded-full">
          Haute Parfumerie
        </span>
        <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4 tracking-tight">
          Fiore
        </h1>
        <p className="text-stone-600 mt-2 text-sm leading-relaxed">
          Estrutura base do e-commerce Fiore atualizada com o novo layout visual.
        </p>
        <div className="mt-6 pt-6 border-t border-stone-100 text-xs text-stone-400">
          API Backend: <span className="font-mono text-stone-600">http://localhost:3333</span>
        </div>
      </div>
    </div>
  );
}

// Área Protegida para Clientes
function ClientePage() {
  const { user } = useAuth();
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-stone-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-stone-200 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Área do Cliente</h2>
        <p className="text-sm text-stone-600">Bem-vindo(a), {user?.nome}!</p>
      </div>
    </div>
  );
}

// Área Protegida para Administradores
function AdminPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-stone-900">
      <div className="max-w-md w-full bg-stone-950 text-amber-50 p-8 rounded-2xl shadow-xl border border-stone-800 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-pink-400 bg-pink-950/60 px-3 py-1 rounded-full">
          Acesso Restrito
        </span>
        <h2 className="text-2xl font-serif font-bold mt-4 mb-2 text-stone-100">Painel do Administrador</h2>
        <p className="text-sm text-stone-400">Gestão de catálogo e pedidos do e-commerce Fiore.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans bg-white">
           <Header />
          
          {/* Rotas e Conteúdo */}
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Rotas exclusivas para visitantes (não logados) */}
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
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}