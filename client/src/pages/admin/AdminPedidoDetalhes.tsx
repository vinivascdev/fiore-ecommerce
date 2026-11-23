import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const AdminPedidoDetalhes: React.FC = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState<any>(null);

  const carregar = async () => {
    const res = await fetch(`http://localhost:3333/api/admin/pedidos/${id}`, {
      credentials: 'include',
    });
    if (res.ok) setPedido(await res.json());
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const marcarComoEnviado = async () => {
    await fetch(`http://localhost:3333/api/admin/pedidos/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'Enviado' }),
    });
    carregar();
  };

  if (!pedido) return <p className="text-sm text-stone-500">Carregando detalhes do pedido...</p>;

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
                <span className="font-semibold">
                  {Number(pedido.valor_total).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Frete</span>
                <span className="font-semibold text-[#DD0088]">Grátis</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-[#DD0088]">
                  {Number(pedido.valor_total).toLocaleString('pt-BR', {
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