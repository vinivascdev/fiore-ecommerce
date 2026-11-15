import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { Header } from './components/Header';
import { Perfil } from './pages/Perfil';
import { useEffect, useState } from 'react';

// Telas do Painel Administrativo
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProdutos } from './pages/admin/AdminProdutos';
import { AdminCategorias } from './pages/admin/AdminCategorias';
import { AdminPedidos } from './pages/admin/AdminPedidos';
import { AdminPedidoDetalhes } from './pages/admin/AdminPedidoDetalhes';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminRelatorios } from './pages/admin/AdminRelatorios';

function HomePage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3333/api/produtos')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProdutos(data);
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#FFF5FA] via-white to-stone-50 py-10 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Banner Institucional */}
        <div className="bg-white/90 border border-pink-100 rounded-3xl p-8 md:p-10 mb-10 text-center shadow-sm">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#D80075] bg-[#FFF0F7] px-3 py-1 rounded-full">
            Haute Parfumerie
          </span>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mt-3 tracking-tight">
            Coleção Fiore
          </h1>
          <p className="text-stone-600 mt-2 text-sm max-w-lg mx-auto">
            Fragrâncias exclusivas criadas para marcar momentos inesquecíveis.
          </p>
        </div>

        {/* Grade de Perfumes Cadastrados */}
        {carregando ? (
          <p className="text-center text-sm text-stone-500">Carregando fragrâncias...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-sm text-stone-500 py-12">
            Nenhum perfume cadastrado no catálogo ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((prod) => {
              const esgotado = prod.quantidade_estoque <= 0;
              return (
                <div
                  key={prod.id_produto}
                  className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <div className="h-44 bg-[#FDF8FB] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden">
                      <img
                        src={prod.imagem_url || 'https://via.placeholder.com/160?text=Fiore'}
                        alt={prod.nome}
                        className="max-h-full object-contain"
                      />
                    </div>

                    <span className="inline-block text-[11px] font-semibold bg-[#FFD6F0] text-[#DD0088] px-3 py-0.5 rounded-full">
                      {prod.categoria?.nome || 'Perfume'}
                    </span>

                    <h2 className="text-base font-bold text-stone-900 mt-2">{prod.nome}</h2>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {prod.descricao_olfativa}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#DD0088]">
                        {Number(prod.preco).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {esgotado ? 'Indisponível' : `${prod.quantidade_estoque} em estoque`}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={esgotado}
                      className="px-4 py-2 rounded-full bg-[#DD0088] hover:bg-[#C4007A] text-white text-xs font-semibold transition disabled:bg-stone-300 disabled:cursor-not-allowed"
                    >
                      {esgotado ? 'Esgotado' : 'Comprar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ClientePage() {
  return <Perfil />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Área Exclusiva do Administrador (usa AdminLayout com Sidebar própria) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="pedidos/:id" element={<AdminPedidoDetalhes />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="relatorios" element={<AdminRelatorios />} />
            {/* <Route path="perfil" element={<Perfil />} /> */}
            <Route path="perfil" element={<Perfil modoAdmin />} />
          </Route>

          {/* Rotas Públicas e do Cliente (usam o Header padrão da loja) */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col font-sans bg-white">
                <Header />

                <main className="flex-1 flex flex-col">
                  <Routes>
                    <Route path="/" element={<HomePage />} />

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
                    <Route
                      path="/recuperar-senha"
                      element={
                        <GuestRoute>
                          <RecuperarSenha />
                        </GuestRoute>
                      }
                    />

                    <Route
                      path="/minha-conta"
                      element={
                        <ProtectedRoute allowedRole="CLIENTE">
                          <ClientePage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}