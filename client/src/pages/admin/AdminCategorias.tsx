import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';

export const AdminCategorias: React.FC = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [nome, setNome] = useState('');

  const carregar = async () => {
    const res = await fetch(`${API_URL}/api/admin/categorias`, { credentials: 'include' });
    setCategorias(await res.json());
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (cat?: any) => {
    setEditando(cat || null);
    setNome(cat ? cat.nome : '');
    setModalAberto(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editando
      ? `${API_URL}/api/admin/categorias/${editando.id_categoria}`
      : `${API_URL}/api/admin/categorias`;

    const res = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome }),
    });

    if (res.ok) {
      setModalAberto(false);
      carregar();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Erro ao salvar categoria');
    }
  };

  const excluir = async (id: number) => {
    if (!confirm('Deseja excluir esta categoria?')) return;
    const res = await fetch(`${API_URL}/api/admin/categorias/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) carregar();
    else alert((await res.json()).message);
  };

  const filtradas = categorias.filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-950">Categorias</h1>
          <p className="text-sm text-stone-600 mt-1">Famílias olfativas e classificações de perfumes</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="inline-flex items-center gap-2 rounded-full bg-[#DD0088] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#C4007A]"
        >
          <img
            src="/icons/plus.svg"
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
          Nova Categoria
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-full border border-[#DD0088] bg-white text-xs focus:outline-none" />
          <div className="absolute left-4 top-3 text-stone-500 text-sm">
            <img
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w- 5"
            />
          </div>
        </div>
        <span className="text-xs text-stone-500">{filtradas.length} Categorias</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#FDF4FA] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-200">
              <th className="py-4 px-4">#ID</th>
              <th className="py-4 px-4">Nome</th>
              <th className="py-4 px-4">Produtos</th>
              <th className="py-4 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtradas.map((c) => (
              <tr key={c.id_categoria} className="hover:bg-stone-50/70">
                <td className="py-4 px-4 font-bold">#{c.id_categoria}</td>
                <td className="py-4 px-4 font-bold text-stone-900">{c.nome}</td>
                <td className="py-4 px-4">{c._count?.produtos ?? 0} itens</td>
                <td className="py-4 px-4 space-x-2">
                  <button
                    onClick={() => excluir(c.id_categoria)}
                    className="border border-red-400 text-red-600 hover:bg-red-50 px-4 py-1 rounded-full font-medium"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => abrirModal(c)}
                    className="border border-[#DD0088] text-[#DD0088] hover:bg-pink-50 px-4 py-1 rounded-full font-medium"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={salvar} className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold">{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <input
              required
              placeholder="Ex: Floral, Amadeirado..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-stone-300 rounded-xl p-3 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-full border text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#DD0088] text-white text-xs font-semibold"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};