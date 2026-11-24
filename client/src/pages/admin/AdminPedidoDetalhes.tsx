import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../config/api';

export const AdminPedidoDetalhes: React.FC = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState<any>(null);

  const carregar = async () => {
    const res = await fetch(`${API_URL}/api/admin/pedidos/${id}`, {
      credentials: 'include',
    });
    if (res.ok) setPedido(await res.json());
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const marcarComoEnviado = async () => {
    await fetch(`${API_URL}/api/admin/pedidos/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'Enviado' }),
    });
    carregar();
  };

  if (!pedido) return <p className="text-sm text-stone-500">Carregando detalhes do pedido...</p>;

  // Cálculo real dos itens
  const subtotalItensCentavos = (pedido.itens || []).reduce(
    (acc: number, item: any) =>
      acc + Math.round(Number(item.preco_unitario) * 100) * Number(item.quantidade),
    0
  );
  const subtotalItens = subtotalItensCentavos / 100;
  const valorTotalCentavos = Math.round(Number(pedido.valor_total || 0) * 100);
  const valorTotal = valorTotalCentavos / 100;

  // Detecção consistente de desconto de cupons (15% ou 10%) e frete
  let descontoCentavos = 0;
  let freteCentavos = 0;
  let matchedCoupon = false;

  for (const taxa of [0.15, 0.1]) {
    const desc = Math.round(subtotalItensCentavos * taxa);
    if (subtotalItensCentavos - desc === valorTotalCentavos) {
      descontoCentavos = desc;
      freteCentavos = 0;
      matchedCoupon = true;
      break;
    }
    if (subtotalItensCentavos - desc + 2490 === valorTotalCentavos) {
      descontoCentavos = desc;
      freteCentavos = 2490;
      matchedCoupon = true;
      break;
    }
  }

  if (!matchedCoupon) {
    if (valorTotalCentavos > subtotalItensCentavos) {
      freteCentavos = valorTotalCentavos - subtotalItensCentavos;
      descontoCentavos = 0;
    } else if (valorTotalCentavos < subtotalItensCentavos) {
      descontoCentavos = subtotalItensCentavos - valorTotalCentavos;
      freteCentavos = 0;
    } else {
      freteCentavos = 0;
      descontoCentavos = 0;
    }
  }

  const desconto = descontoCentavos / 100;
  const frete = freteCentavos / 100;

  return (
    <div className="max-w-5xl space-y-6">
      <Link to="/admin/pedidos" className="text-xs font-semibold text-[#DD0088] hover:underline print:hidden">
        ← Voltar para pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-stone-950">Pedido #{pedido.id_pedido}</h1>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
              {pedido.status}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Realizado em {new Date(pedido.data_pedido).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="border border-[#DD0088] text-[#DD0088] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-pink-50"
          >
            Imprimir pedido
          </button>
          {pedido.status !== 'Enviado' && (
            <button
              onClick={marcarComoEnviado}
              className="bg-[#DD0088] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#C4007A]"
            >
              Marcar como enviado
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Itens + Entrega */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-bold text-sm mb-4">Itens do pedido</h2>
            <div className="divide-y divide-stone-100">
              {pedido.itens.map((item: any) => (
                <div key={item.id_item_pedido} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-stone-900">{item.produto?.nome}</p>
                    <p className="text-xs text-stone-500">
                      {item.produto?.categoria?.nome} · Quantidade: {item.quantidade}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    {Number(item.preco_unitario).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 mt-4 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {subtotalItens.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto</span>
                  <span>
                    -{' '}
                    {desconto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Frete</span>
                <span className={`font-semibold ${frete > 0 ? 'text-stone-900' : 'text-[#DD0088]'}`}>
                  {frete > 0
                    ? frete.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : 'Grátis'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-100">
                <span>Total</span>
                <span className="text-[#DD0088]">
                  {valorTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-bold text-sm mb-3">Entrega</h2>
            <p className="text-[11px] font-bold uppercase text-stone-400">Endereço de Entrega</p>
            <p className="text-xs font-bold text-stone-900 mt-1">{pedido.cliente?.nome}</p>
            <p className="text-xs text-stone-600 mt-0.5">{pedido.cliente?.endereco}</p>
          </div>
        </div>

        {/* Coluna Direita: Cliente */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-bold text-sm mb-4">Cliente</h2>
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-[#FFD6F0] text-[#DD0088] font-bold flex items-center justify-center">
                {pedido.cliente?.nome.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">{pedido.cliente?.nome}</p>
                <p className="text-xs text-stone-500">
                  {pedido.cliente?._count?.pedidos || 1} pedidos
                </p>
              </div>
            </div>
            <div className="pt-4 space-y-1.5 text-xs text-stone-700">
              <p>{pedido.cliente?.email}</p>
              <p>{pedido.cliente?.telefone || 'Telefone não informado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};