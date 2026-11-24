import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RecuperarSenha } from "./pages/RecuperarSenha";
import { Termos } from "./pages/Termos";
import { Privacidade } from "./pages/Privacidade";
import { Header } from "./components/Header";
import { Perfil } from "./pages/Perfil";
import { useEffect, useRef, useState } from "react";
import { formatImageUrl } from "./utils/image";
import { API_URL } from "./config/api";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = searchParams.get("busca")?.trim() || "";

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
    fetch(`${API_URL}/api/produtos`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProdutos(data);
      })
      .finally(() => setCarregando(false));
  }, []);

  // Garante a exibição estrita apenas de produtos disponíveis em estoque (quantidade > 0)
  const produtosEmEstoque = produtos.filter((p) => Number(p.quantidade_estoque) > 0);

  // Filtra produtos pela busca do Header (nome, descrição olfativa ou categoria)
  const produtosFiltrados = produtosEmEstoque.filter((prod) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    const nome = (prod.nome || "").toLowerCase();
    const descricao = (prod.descricao_olfativa || "").toLowerCase();
    const categoria = (prod.categoria?.nome || "").toLowerCase();
    return (
      nome.includes(termo) ||
      descricao.includes(termo) ||
      categoria.includes(termo)
    );
  });

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
          {produtosEmEstoque[0]?.imagem_url && (
            <img
              src={formatImageUrl(produtosEmEstoque[0].imagem_url)}
              alt="Perfume em destaque"
              className="absolute z-10 inset-0 w-full h-full object-contain p-5 md:p-8 drop-shadow-xl"
            />
          )}
        </div>
      </section>

      {/* SEÇÃO DE PRODUTOS */}
      <div className="w-full px-8 md:px-12 lg:px-16 py-10">
        {/* Título e descrição */}
        <div id="produtos" className="mb-6 scroll-mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#151C2E] tracking-tight">
              {busca ? `Resultados da busca por "${busca}"` : "Mais Procurados do Momento"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {busca
                ? `${produtosFiltrados.length} fragrância(s) encontrada(s) com estoque garantido.`
                : "Confira as novidades com estoque garantido a pronta entrega."}
            </p>
          </div>

          {busca && (
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-1.5 rounded-full border border-[#DD0088] text-[#DD0088] hover:bg-pink-50 text-xs font-semibold transition"
            >
              ✕ Limpar busca
            </button>
          )}
        </div>

        {/* Carregamento dos produtos */}
        {carregando ? (
          <p className="text-center text-sm text-stone-500">
            Carregando fragrâncias...
          </p>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto">
            <p className="text-base font-bold text-stone-800">
              {busca
                ? `Nenhum perfume encontrado para "${busca}".`
                : "Nenhum perfume disponível em estoque no momento."}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {busca
                ? "Tente buscar por outro termo, nome da fragrância ou família olfativa."
                : "Volte em breve para conferir novas reposições do nosso catálogo de luxo."}
            </p>
            {busca && (
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 px-5 py-2 rounded-full bg-[#DD0088] text-white text-xs font-semibold hover:bg-[#C4007A] transition"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map((prod) => {
              return (
                <div
                  key={prod.id_produto}
                  className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {/* Imagem do produto */}
                    <div className="h-44 bg-[#FDF8FB] rounded-xl flex items-center justify-center p-4 mb-4 overflow-hidden border border-stone-100">
                      <img
                        src={formatImageUrl(prod.imagem_url)}
                        alt={prod.nome}
                        className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Categoria */}
                    <span className="inline-block text-[11px] font-semibold bg-[#FFD6F0] text-[#DD0088] px-3 py-0.5 rounded-full">
                      {prod.categoria?.nome || "Perfume"}
                    </span>

                    {/* Nome */}
                    <h3 className="text-base font-bold text-stone-900 mt-2 line-clamp-1">
                      {prod.nome}
                    </h3>

                    {/* Descrição Olfativa em destaque */}
                    <div className="mt-1.5 p-2 bg-stone-50 rounded-lg border border-stone-100">
                      <p className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-0.5">
                        Pirâmide Olfativa
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {prod.descricao_olfativa || "Fragrância sofisticada e marcante da perfumaria Fiore."}
                      </p>
                    </div>
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

                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        {prod.quantidade_estoque} un. disponíveis
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdicionar(prod)}
                      className={`px-4 py-2 rounded-full text-white text-xs font-semibold transition shadow-sm ${
                        adicionadoId === prod.id_produto
                          ? "bg-emerald-600"
                          : "bg-[#DD0088] hover:bg-[#C4007A]"
                      }`}
                    >
                      {adicionadoId === prod.id_produto
                        ? "Adicionado!"
                        : "Adicionar"}
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
                      <Route path="/termos" element={<Termos />} />
                      <Route path="/privacidade" element={<Privacidade />} />

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
