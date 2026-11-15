import React, { useEffect, useState } from 'react';

export const AdminProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  const [form, setForm] = useState({
    nome: '',
    descricao_olfativa: '',
    preco: '',
    quantidade_estoque: '',
    imagem_url: '',
    id_categoria: '',
  });

  const carregarDados = async () => {
    const [resProd, resCat] = await Promise.all([
      fetch('http://localhost:3333/api/admin/produtos', { credentials: 'include' }),
      fetch('http://localhost:3333/api/admin/categorias', { credentials: 'include' }),
    ]);
    setProdutos(await resProd.json());
    setCategorias(await resCat.json());
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const abrirModal = (produto?: any) => {
    if (produto) {
      setEditando(produto);
      setForm({
        nome: produto.nome,
        descricao_olfativa: produto.descricao_olfativa,
        preco: String(produto.preco),
        quantidade_estoque: String(produto.quantidade_estoque),
        imagem_url: produto.imagem_url,
        id_categoria: String(produto.id_categoria),
      });
    } else {
      setEditando(null);
      setForm({
        nome: '',
        descricao_olfativa: '',
        preco: '',
        quantidade_estoque: '0',
        imagem_url: '',
        id_categoria: categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : '',
      });
    }
    setModalAberto(true);
  };

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editando
      ? `http://localhost:3333/api/admin/produtos/${editando.id_produto}`
      : 'http://localhost:3333/api/admin/produtos';
    const method = editando ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setModalAberto(false);
      carregarDados();
    } else {
      const err = await res.json();
      alert(err.message || 'Erro ao salvar produto');
    }
  };

  const excluirProduto = async (id: number) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    const res = await fetch(`http://localhost:3333/api/admin/produtos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) carregarDados();
    else alert((await res.json()).message);
  };

  const filtrados = produtos.filter((p) => {
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao_olfativa.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria ? String(p.id_categoria) === filtroCategoria : true;
    return matchBusca && matchCat;
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-950">Estoque de Produtos</h1>
          <p className="text-sm text-stone-600 mt-1">{produtos.length} Perfumes Cadastrados</p>
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
          
          Novo Produto
        </button>
      </div>

      {/* Barra de Busca + Filtro Categoria */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[260px] relative">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição"
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

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="h-11 px-6 rounded-full border border-[#DD0088] bg-white text-xs font-medium text-stone-800 focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>
              {c.nome}
            </option>
          ))}
        </select>

        <span className="text-xs text-stone-500">{filtrados.length} Resultados</span>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#FDF4FA] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-200">
              <th className="py-4 px-4">#ID</th>
              <th className="py-4 px-4">Foto</th>
              <th className="py-4 px-4">Produto</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Estoque</th>
              <th className="py-4 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtrados.map((p) => (
              <tr key={p.id_produto} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 font-bold">#{p.id_produto}</td>
                <td className="py-3.5 px-4">
                  <img
                    src={p.imagem_url || 'https://via.placeholder.com/48'}
                    alt={p.nome}
                    className="w-12 h-12 object-contain mx-auto rounded-lg"
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-stone-900">{p.nome}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#FFD6F0] text-[#DD0088] font-semibold px-4 py-1 rounded-full">
                    {p.categoria?.nome}
                  </span>
                </td>
                <td className="py-3.5 px-4">{p.quantidade_estoque} itens</td>
                <td className="py-3.5 px-4 space-x-2">
                  <button
                    onClick={() => excluirProduto(p.id_produto)}
                    className="border border-red-400 text-red-600 hover:bg-red-50 px-4 py-1 rounded-full font-medium"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => abrirModal(p)}
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

      {/* Modal Criar/Editar Produto */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={salvarProduto}
            className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl"
          >
            <h2 className="text-lg font-bold text-stone-900">
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <div>
              <label className="block text-xs font-bold mb-1">Nome do Perfume</label>
              <input
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Descrição Olfativa</label>
              <input
                required
                value={form.descricao_olfativa}
                onChange={(e) => setForm({ ...form, descricao_olfativa: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Estoque</label>
                <input
                  type="number"
                  required
                  value={form.quantidade_estoque}
                  onChange={(e) => setForm({ ...form, quantidade_estoque: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Categoria</label>
              <select
                required
                value={form.id_categoria}
                onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">URL da Imagem</label>
              <input
                value={form.imagem_url}
                onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold"
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