import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

export const AdminPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    const res = await fetch(`${API_URL}/api/admin/pedidos`, { credentials: 'include' });
    setPedidos(await res.json());
  };

  useEffect(() => {
    carregar();
  }, []);

  const excluirPedido = async (id: number) => {
    if (!confirm(`Deseja realmente excluir o pedido #${id}?`)) return;
    const res = await fetch(`${API_URL}/api/admin/pedidos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) carregar();
  };

  const filtrados = pedidos.filter(
    (p) =>
      p.cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
      String(p.id_pedido).includes(busca)
  );

  const valorTotalGeral = pedidos.reduce((acc, p) => acc + Number(p.valor_total), 0);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-950">Gestão de Pedidos</h1>
        <p className="text-sm text-stone-600 mt-1">
          {pedidos.length} pedidos ·{' '}
          {valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} no total
        </p>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente ou número do pedido"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-full border border-[#DD0088] bg-white text-xs focus:outline-none"
        />
          <div className="absolute left-4 top-3 text-stone-500 text-sm">
            <img
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w- 5"
            />
          </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#FDF4FA] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-200">
              <th className="py-4 px-4">#ID</th>
              <th className="py-4 px-4">Cliente</th>
              <th className="py-4 px-4">Data</th>
              <th className="py-4 px-4">Produtos</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Total</th>
              <th className="py-4 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtrados.map((p) => {
              const totalItens = p.itens.reduce((acc: number, i: any) => acc + i.quantidade, 0);
              const enviado = p.status === 'Enviado';
              return (
                <tr key={p.id_pedido} className="hover:bg-stone-50/70">
                  <td className="py-4 px-4 font-bold">#{p.id_pedido}</td>
                  <td className="py-4 px-4 font-bold text-stone-900">{p.cliente?.nome}</td>
                  <td className="py-4 px-4">{new Date(p.data_pedido).toISOString().split('T')[0]}</td>
                  <td className="py-4 px-4">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-1 rounded-full font-semibold ${
                        enviado
                          ? 'bg-[#FFD6F0] text-[#DD0088]'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#DD0088]">
                    {Number(p.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-4 px-4 space-x-2">
                    <button
                      onClick={() => excluirPedido(p.id_pedido)}
                      className="border border-red-400 text-red-600 hover:bg-red-50 px-4 py-1 rounded-full font-medium"
                    >
                      Excluir
                    </button>
                    <Link
                      to={`/admin/pedidos/${p.id_pedido}`}
                      className="inline-block border border-[#DD0088] text-[#DD0088] hover:bg-pink-50 px-4 py-1 rounded-full font-medium"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};