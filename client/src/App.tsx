import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecuperarSenha } from "./pages/RecuperarSenha";
import { Header } from "./components/Header";
import { Perfil } from "./pages/Perfil";
import { useEffect, useRef, useState } from "react";

// Telas do Painel Administrativo
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProdutos } from "./pages/admin/AdminProdutos";
import { AdminCategorias } from "./pages/admin/AdminCategorias";
import { AdminPedidos } from "./pages/admin/AdminPedidos";
import { AdminPedidoDetalhes } from "./pages/admin/AdminPedidoDetalhes";
import { AdminUsuarios } from "./pages/admin/AdminUsuarios";
import { AdminRelatorios } from "./pages/admin/AdminRelatorios";
import { Carrinho } from "./pages/Carrinho";
import { CarrinhoProvider, useCarrinho } from "./context/CarrinhoContext";

function HomePage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { adicionar } = useCarrinho();

  const [adicionadoId, setAdicionadoId] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdicionar = (prod: any) => {
    if (!adicionar(prod)) {
      window.alert(
        "Não há mais unidades disponíveis deste produto no estoque.",
      );
      return;
    }

    setAdicionadoId(prod.id_produto);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdicionadoId(null), 1500);
  };

  useEffect(() => {
    fetch("http://localhost:3333/api/produtos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProdutos(data);
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#FFF5FA] via-white to-stone-50">
      {/* BANNER PROMOCIONAL */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[280px] md:min-h-[320px]">
        {/* Conteúdo textual */}
        <div className="bg-[#F5F8FB] flex flex-col justify-center px-8 py-12 md:px-12 lg:px-16">
          <div className="max-w-xl mx-auto w-full">
            <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#DD0088] bg-[#FCE5F3] px-3 py-1 rounded-full w-fit">
              Últimas novidades
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-[42px] leading-tight font-bold text-[#151C2E] mt-4 tracking-tight">
              Lançamento Rose Absolute com 50% OFF
            </h1>

            <p className="text-sm text-slate-600 mt-2">
              Um floral sofisticado e cheio de personalidade.
            </p>

            <p className="text-[10px] text-slate-400 mt-3">
              Aproveite nossas ofertas especiais. Descontos aplicados sobre o
              preço original.
            </p>

            <a
              href="#produtos"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-[#DD0088] hover:bg-[#C4007A] text-white text-xs font-semibold transition shadow-sm"
            >
              <span>➜</span>
              Ver Produtos
            </a>
          </div>
        </div>

        {/* Imagem e composição visual */}
        <div className="relative min-h-[240px] md:min-h-full overflow-hidden bg-[#F8DADD]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FBE2E3] via-[#EFC7CD] to-[#C9AEB2]" />

          <div
            className="absolute inset-y-0 right-0 w-[48%] bg-[#B00079]"
            style={{
              clipPath: "polygon(75% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          <div
            className="absolute inset-y-0 right-[12%] w-[35%] bg-[#E50091]"
            style={{
              clipPath: "polygon(100% 0, 100% 0, 0 100%, 0 100%)",
            }}
          />

          {/* Perfume em destaque */}
          {produtos[0]?.imagem_url && (
            <img
              src={produtos[0].imagem_url}
              alt="Perfume em destaque"
              className="absolute z-10 inset-0 w-full h-full object-contain p-5 md:p-8 drop-shadow-xl"
            />
          )}
        </div>
      </section>

      {/* SEÇÃO DE PRODUTOS */}
      <div className="w-full px-8 md:px-12 lg:px-16 py-10">
        {/* Título e descrição */}
        <div id="produtos" className="mb-6 scroll-mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#151C2E] tracking-tight">
            Mais Procurados do Momento
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Confira as novidades selecionadas para você com estoque garantido e
            entrega rápida.
          </p>
        </div>

        {/* Carregamento dos produtos */}
        {carregando ? (
          <p className="text-center text-sm text-stone-500">
            Carregando fragrâncias...
          </p>
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
                    {/* Imagem do produto */}
                    <div className="h-44 bg-[#FDF8FB] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden">
                      <img
                        src={
                          prod.imagem_url ||
                          "https://via.placeholder.com/160?text=Fiore"
                        }
                        alt={prod.nome}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Categoria */}
                    <span className="inline-block text-[11px] font-semibold bg-[#FFD6F0] text-[#DD0088] px-3 py-0.5 rounded-full">
                      {prod.categoria?.nome || "Perfume"}
                    </span>

                    {/* Nome */}
                    <h2 className="text-base font-bold text-stone-900 mt-2">
                      {prod.nome}
                    </h2>

                    {/* Descrição */}
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {prod.descricao_olfativa}
                    </p>
                  </div>

                  {/* Preço e botão */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#DD0088]">
                        {Number(prod.preco).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>

                      <p className="text-[11px] text-stone-400">
                        {esgotado
                          ? "Indisponível"
                          : `${prod.quantidade_estoque} em estoque`}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={esgotado}
                      onClick={() => handleAdicionar(prod)}
                      className={`px-4 py-2 rounded-full text-white text-xs font-semibold transition disabled:bg-stone-300 disabled:cursor-not-allowed ${
                        adicionadoId === prod.id_produto
                          ? "bg-green-600"
                          : "bg-[#DD0088] hover:bg-[#C4007A]"
                      }`}
                    >
                      {esgotado
                        ? "Esgotado"
                        : adicionadoId === prod.id_produto
                          ? "Produto adicionado!"
                          : "Adicionar ao carrinho"}
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
      <CarrinhoProvider>
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
                      <Route path="/carrinho" element={<Carrinho />} />

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
      </CarrinhoProvider>
    </AuthProvider>
  );
}
