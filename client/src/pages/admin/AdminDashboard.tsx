import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/admin/dashboard`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.message || `Erro ${r.status} ao carregar dashboard.`);
        }
        return r.json();
      })
      .then(setDados)
      .catch((e) => setErro(e.message));
  }, []);

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
        {erro}
      </div>
    );
  }

  if (!dados) return <p className="text-sm text-stone-500">Carregando painel...</p>;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-950">Painel Administrativo</h1>
        <p className="text-sm text-stone-600 mt-1">
          Bem-vindo de volta, {user?.nome?.split(' ')[0]}. Aqui está o resumo de hoje.
        </p>
      </div>

      {/* 4 Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/receita.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="text-xs font-medium text-stone-600">Receita Total</p>
          <p className="text-2xl font-bold text-stone-950 mt-1">
            {(dados.receitaTotal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/cliente.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="text-xs font-medium text-stone-600">Clientes</p>
          <p className="text-2xl font-bold text-stone-950 mt-1">{dados.totalClientes ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/categorias.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="text-xs font-medium text-stone-600">Categorias</p>
          <p className="text-2xl font-bold text-stone-950 mt-1">{dados.totalCategorias ?? 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/estoque.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="text-xs font-medium text-stone-600">Sem Estoque</p>
          <p className="text-2xl font-bold text-stone-950 mt-1">{dados.semEstoqueCount ?? 0}</p>
        </div>
      </div>

      {/* Listas Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-bold text-sm text-stone-900">Pedidos Recentes</h2>
            <Link to="/admin/pedidos" className="text-xs font-semibold text-[#DD0088] hover:underline">
              Ver todos os pedidos →
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {(dados.pedidosRecentes ?? []).map((p: any) => (
              <div key={p.id_pedido} className="px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFD6F0] text-[#DD0088] font-bold text-xs flex items-center justify-center">
                    {p.cliente?.nome?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{p.cliente?.nome}</p>
                    <p className="text-xs text-stone-400">
                      #{p.id_pedido} · {new Date(p.data_pedido).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#DD0088]">
                  {Number(p.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
            {(dados.pedidosRecentes ?? []).length === 0 && (
              <p className="p-6 text-xs text-stone-400 text-center">Nenhum pedido registrado.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-bold text-sm text-stone-900">Produtos em Falta</h2>
            <Link to="/admin/produtos" className="text-xs font-semibold text-[#DD0088] hover:underline">
              Ver todo o estoque →
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {(dados.produtosSemEstoque ?? []).map((prod: any) => (
              <div key={prod.id_produto} className="px-6 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{prod.nome}</p>
                  <p className="text-xs text-stone-400">{prod.categoria?.nome}</p>
                </div>
                <span className="text-xs font-bold text-[#DD0088] uppercase">Esgotado</span>
              </div>
            ))}
            {(dados.produtosSemEstoque ?? []).length === 0 && (
              <p className="p-6 text-xs text-stone-400 text-center">Nenhum produto esgotado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};