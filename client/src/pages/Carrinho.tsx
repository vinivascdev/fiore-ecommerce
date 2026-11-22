import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrinho } from "../context/CarrinhoContext";
import { formatImageUrl } from "../utils/image";

const FRETE_FIXO = 24.9;
const FRETE_GRATIS_ACIMA = 199;
const CUPONS: Record<string, number> = { FIORE10: 10, BEMVINDO15: 15 }; // % de desconto

const formatarCep = (valor: string) => {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function Carrinho() {
  const { itens, atualizarQuantidade, remover, limpar } = useCarrinho();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [cep, setCep] = useState("");
  const [freteCalculado, setFreteCalculado] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [cupomInput, setCupomInput] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<{
    codigo: string;
    percentual: number;
  } | null>(null);
  const [erroCupom, setErroCupom] = useState("");

  const subtotal = itens.reduce(
    (soma, item) => soma + Number(item.produto.preco) * item.quantidade,
    0,
  );
  const quantidadeTotal = itens.reduce(
    (soma, item) => soma + item.quantidade,
    0,
  );
  const desconto = cupomAplicado
    ? (subtotal * cupomAplicado.percentual) / 100
    : 0;
  const subtotalComDesconto = subtotal - desconto;
  const gratis = subtotalComDesconto > FRETE_GRATIS_ACIMA;
  const frete = !gratis && freteCalculado ? FRETE_FIXO : 0;
  const total = subtotalComDesconto + frete;

  const finalizarCompra = async () => {
    setErro("");
    setSucesso("");
    if (!user) {
      navigate("/login", { state: { from: "/carrinho" } });
      return;
    }
    if (user.tipo_usuario !== "CLIENTE") {
      setErro(
        "A finalização de compras está disponível apenas para contas de cliente.",
      );
      return;
    }
    if (itens.length === 0) return;

    setFinalizando(true);
    try {
      const resposta = await fetch("http://localhost:3333/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itens: itens.map((item) => ({
            id_produto: item.produto.id_produto,
            quantidade: item.quantidade,
          })),
        }),
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok)
        throw new Error(
          resultado.message || "Não foi possível finalizar a compra.",
        );

      limpar();
      setSucesso(
        `Pedido #${resultado.id_pedido} realizado com sucesso! Total: ${moeda(Number(resultado.valor_total))}.`,
      );
    } catch (erroRecebido) {
      setErro(
        erroRecebido instanceof Error
          ? erroRecebido.message
          : "Erro ao finalizar a compra.",
      );
    } finally {
      setFinalizando(false);
    }
  };

  const calcularFrete = () => {
    if (gratis) return;
    if (cep.replace(/\D/g, "").length !== 8) {
      setErroCep("Digite um CEP válido com 8 dígitos.");
      setFreteCalculado(false);
      return;
    }
    setErroCep("");
    setFreteCalculado(true);
  };

  const aplicarCupom = () => {
    const codigo = cupomInput.trim().toUpperCase();
    if (!codigo) return;
    const percentual = CUPONS[codigo];
    if (!percentual) {
      setErroCupom("Cupom inválido.");
      setCupomAplicado(null);
      return;
    }
    setErroCupom("");
    setCupomAplicado({ codigo, percentual });
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#FFF5FA] via-white to-stone-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 border-b border-stone-200 pb-3">
          <h1 className="text-lg font-bold text-stone-950">
            Carrinho de Compras
          </h1>
        </div>

        {sucesso && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {sucesso}{" "}
            <Link to="/minha-conta" className="font-semibold underline">
              Ver meus pedidos
            </Link>
          </div>
        )}
        {erro && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {itens.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="text-stone-600">Seu carrinho está vazio.</p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full bg-[#DD0088] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Ver produtos
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-5 shadow-sm">
              {itens.map(({ produto, quantidade }) => {
                const estoque = Number(produto.quantidade_estoque);
                const estoqueAlto = estoque > 20;

                return (
                  <article
                    key={produto.id_produto}
                    className="flex items-center gap-4 py-6"
                  >
                    {/* Imagem */}
                    <img
                      src={formatImageUrl(produto.imagem_url)}
                      alt={produto.nome}
                      className="h-20 w-20 shrink-0 rounded-2xl bg-[#FDF8FB] object-contain p-2 shadow-md"
                    />

                    {/* Nome, descrição e estoque */}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold leading-snug text-[#151C2E]">
                        {produto.nome}
                      </h2>
                      {produto.descricao_olfativa && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">
                          {produto.descricao_olfativa}
                        </p>
                      )}
                      <span
                        className={`mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          estoqueAlto
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {estoqueAlto
                          ? `${estoque} unidades`
                          : `${estoque} ${estoque === 1 ? "unidade restante" : "unidades restantes"}`}
                      </span>
                    </div>

                    {/* Seletor de quantidade */}
                    <div className="flex h-10 shrink-0 items-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                      <button
                        type="button"
                        aria-label={
                          quantidade <= 1
                            ? "Remover produto"
                            : "Diminuir quantidade"
                        }
                        onClick={() =>
                          quantidade <= 1
                            ? remover(produto.id_produto)
                            : atualizarQuantidade(
                                produto.id_produto,
                                quantidade - 1,
                              )
                        }
                        className="h-full w-10 text-lg font-bold text-stone-900 transition hover:bg-stone-200"
                      >
                        −
                      </button>
                      <span className="flex h-full w-12 items-center justify-center bg-white text-sm font-semibold text-stone-900">
                        {quantidade}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        title={
                          quantidade >= estoque
                            ? "Limite de estoque atingido"
                            : undefined
                        }
                        disabled={quantidade >= estoque}
                        onClick={() =>
                          atualizarQuantidade(
                            produto.id_produto,
                            quantidade + 1,
                          )
                        }
                        className="h-full w-10 text-lg font-bold text-stone-900 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {/* Preços */}
                    <div className="w-28 shrink-0 text-center">
                      <p className="text-lg font-bold text-stone-950">
                        {moeda(Number(produto.preco) * quantidade)}
                      </p>
                      <p className="text-xs text-stone-600">
                        {moeda(Number(produto.preco))} cada
                      </p>
                    </div>

                    {/* Remover */}
                    <button
                      type="button"
                      aria-label={`Remover ${produto.nome}`}
                      onClick={() => remover(produto.id_produto)}
                      className="shrink-0 p-1 text-red-600 transition hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-6 w-6"
                      >
                        <path d="M4 7h16" />
                        <path d="M9 7V4h6v3" />
                        <path d="M6 7v13h12V7" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                      </svg>
                    </button>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-center text-lg font-bold text-stone-900">
                Resumo da Compra
              </h2>

              {/* CEP */}
              <div className="mt-5">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite o CEP"
                  value={cep}
                  onChange={(e) => {
                    setCep(formatarCep(e.target.value));
                    setFreteCalculado(false);
                  }}
                  className="h-10 w-full rounded-full bg-stone-100 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#DD0088]"
                />
                {erroCep && (
                  <p className="mt-1 px-2 text-[11px] text-red-600">
                    {erroCep}
                  </p>
                )}
                <button
                  type="button"
                  onClick={calcularFrete}
                  disabled={gratis}
                  className="mt-3 h-10 w-full rounded-full bg-[#DD0088] text-xs font-bold text-white transition enabled:hover:bg-[#C4007A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Calcular Frete
                </button>
                {gratis && (
                  <p className="mt-1 px-2 text-[11px] text-green-700">
                    Frete grátis para compra acima de R$ 199
                  </p>
                )}
              </div>

              {/* Cupom */}
              <div className="mt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de Cupom"
                    value={cupomInput}
                    onChange={(e) => setCupomInput(e.target.value)}
                    className="h-10 min-w-0 flex-1 rounded-full bg-stone-100 px-4 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#DD0088]"
                  />
                  <button
                    type="button"
                    onClick={aplicarCupom}
                    className="h-10 rounded-full bg-[#DD0088] px-5 text-xs font-bold text-white transition hover:bg-[#C4007A]"
                  >
                    Adicionar
                  </button>
                </div>
                {erroCupom && (
                  <p className="mt-1 px-2 text-[11px] text-red-600">
                    {erroCupom}
                  </p>
                )}
                {cupomAplicado && (
                  <p className="mt-1 px-2 text-[11px] text-green-700">
                    Cupom {cupomAplicado.codigo} aplicado (
                    {cupomAplicado.percentual}% de desconto).
                  </p>
                )}
              </div>

              {/* Valores */}
              <dl className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-stone-700">
                    Subtotal dos itens ({quantidadeTotal}{" "}
                    {quantidadeTotal === 1 ? "item" : "itens"})
                  </dt>
                  <dd className="text-stone-900">{moeda(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-700">Cupom de Desconto</dt>
                  <dd className="text-red-600">- {moeda(desconto)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-700">Frete</dt>
                  <dd className="text-stone-900">{moeda(frete)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                <span className="text-base font-bold text-[#DD0088]">
                  Total
                </span>
                <strong className="text-base text-[#DD0088]">
                  {moeda(total)}
                </strong>
              </div>

              {!user && (
                <p className="mt-3 text-xs text-stone-500">
                  Entre como cliente para finalizar a compra.
                </p>
              )}

              <button
                type="button"
                onClick={finalizarCompra}
                disabled={finalizando}
                className="mt-5 w-full rounded-full bg-[#DD0088] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#C4007A] disabled:opacity-60"
              >
                {finalizando
                  ? "Finalizando..."
                  : user
                    ? "Ir para Pagamento"
                    : "Entrar para comprar"}
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-xs font-semibold text-[#DD0088] hover:underline"
              >
                Continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
