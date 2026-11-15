import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Carrinho() {
  const { itens, atualizarQuantidade, remover, limpar } = useCarrinho();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const total = itens.reduce(
    (soma, item) => soma + Number(item.produto.preco) * item.quantidade,
    0
  );

  const finalizarCompra = async () => {
    setErro('');
    setSucesso('');
    if (!user) {
      navigate('/login', { state: { from: '/carrinho' } });
      return;
    }
    if (user.tipo_usuario !== 'CLIENTE') {
      setErro('A finalização de compras está disponível apenas para contas de cliente.');
      return;
    }
    if (itens.length === 0) return;

    setFinalizando(true);
    try {
      const resposta = await fetch('http://localhost:3333/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          itens: itens.map((item) => ({
            id_produto: item.produto.id_produto,
            quantidade: item.quantidade,
          })),
        }),
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(resultado.message || 'Não foi possível finalizar a compra.');

      limpar();
      setSucesso(`Pedido #${resultado.id_pedido} realizado com sucesso! Total: ${moeda(Number(resultado.valor_total))}.`);
    } catch (erroRecebido) {
      setErro(erroRecebido instanceof Error ? erroRecebido.message : 'Erro ao finalizar a compra.');
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#FFF5FA] via-white to-stone-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-stone-950">Carrinho de compras</h1>

        {sucesso && (
          <div role="status" className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {sucesso}{' '}
            <Link to="/minha-conta" className="font-semibold underline">Ver meus pedidos</Link>
          </div>
        )}
        {erro && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erro}</div>}

        {itens.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="text-stone-600">Seu carrinho está vazio.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-[#DD0088] px-5 py-2.5 text-sm font-semibold text-white">Ver produtos</Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white px-5 shadow-sm">
              {itens.map(({ produto, quantidade }) => (
                <article key={produto.id_produto} className="flex flex-wrap items-center gap-4 py-5">
                  <img src={produto.imagem_url || 'https://via.placeholder.com/160?text=Fiore'} alt="" className="h-20 w-20 rounded-xl bg-[#FDF8FB] object-contain p-2" />
                  <div className="min-w-40 flex-1">
                    <h2 className="font-semibold text-stone-900">{produto.nome}</h2>
                    <p className="mt-1 text-xs text-stone-500">{moeda(Number(produto.preco))} cada</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`quantidade-${produto.id_produto}`} className="text-xs text-stone-500">Qtd.</label>
                    <input
                      id={`quantidade-${produto.id_produto}`}
                      type="number"
                      min="1"
                      max={produto.quantidade_estoque}
                      value={quantidade}
                      onChange={(event) => atualizarQuantidade(produto.id_produto, Number(event.target.value))}
                      className="h-9 w-16 rounded-lg border border-stone-300 px-2 text-center text-sm"
                    />
                  </div>
                  <p className="w-24 text-right text-sm font-bold text-[#DD0088]">{moeda(Number(produto.preco) * quantidade)}</p>
                  <button type="button" onClick={() => remover(produto.id_produto)} className="text-xs font-semibold text-red-600 hover:underline">Remover</button>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">Resumo</h2>
              <div className="mt-5 flex justify-between border-t border-stone-100 pt-4 text-sm">
                <span className="text-stone-600">Total</span>
                <strong className="text-[#DD0088]">{moeda(total)}</strong>
              </div>
              {!user && <p className="mt-3 text-xs text-stone-500">Entre como cliente para finalizar a compra.</p>}
              <button
                type="button"
                onClick={finalizarCompra}
                disabled={finalizando}
                className="mt-5 w-full rounded-full bg-[#DD0088] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C4007A] disabled:opacity-60"
              >
                {finalizando ? 'Finalizando...' : user ? 'Finalizar compra' : 'Entrar para comprar'}
              </button>
              <Link to="/" className="mt-4 block text-center text-xs font-semibold text-[#DD0088] hover:underline">Continuar comprando</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
