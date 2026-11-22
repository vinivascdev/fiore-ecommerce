import React, { useEffect, useRef, useState } from 'react';
import { formatImageUrl } from '../../utils/image';

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

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const carregarDados = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('http://localhost:3333/api/admin/produtos', { credentials: 'include' }),
        fetch('http://localhost:3333/api/admin/categorias', { credentials: 'include' }),
      ]);
      if (resProd.ok) setProdutos(await resProd.json());
      if (resCat.ok) setCategorias(await resCat.json());
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const abrirModal = (produto?: any) => {
    setUploadError('');
    if (produto) {
      setEditando(produto);
      setForm({
        nome: produto.nome,
        descricao_olfativa: produto.descricao_olfativa,
        preco: String(produto.preco),
        quantidade_estoque: String(produto.quantidade_estoque),
        imagem_url: produto.imagem_url || '',
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('foto', file);

      const res = await fetch('http://localhost:3333/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao realizar upload da imagem.');
      }

      setForm((prev) => ({ ...prev, imagem_url: data.url }));
    } catch (err: any) {
      console.error('Falha no upload:', err);
      setUploadError(err.message || 'Falha ao enviar arquivo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoverFoto = () => {
    setForm((prev) => ({ ...prev, imagem_url: '' }));
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editando
      ? `http://localhost:3333/api/admin/produtos/${editando.id_produto}`
      : 'http://localhost:3333/api/admin/produtos';
    const method = editando ? 'PUT' : 'POST';

    try {
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
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Erro ao salvar produto');
      }
    } catch (err) {
      alert('Erro ao se comunicar com o servidor.');
    }
  };

  const excluirProduto = async (id: number) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      const res = await fetch(`http://localhost:3333/api/admin/produtos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        carregarDados();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Não foi possível excluir o produto.');
      }
    } catch {
      alert('Erro de conexão ao excluir produto.');
    }
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
              className="h-5 w-5"
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

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#FDF4FA] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-200">
              <th className="py-4 px-4">#ID</th>
              <th className="py-4 px-4">Foto</th>
              <th className="py-4 px-4">Produto</th>
              <th className="py-4 px-4">Categoria</th>
              <th className="py-4 px-4">Estoque</th>
              <th className="py-4 px-4">Preço</th>
              <th className="py-4 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-stone-400">
                  Nenhum perfume encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map((p) => (
                <tr key={p.id_produto} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 font-bold text-stone-500">#{p.id_produto}</td>
                  <td className="py-3.5 px-4">
                    <img
                      src={formatImageUrl(p.imagem_url)}
                      alt={p.nome}
                      className="w-12 h-12 object-contain mx-auto rounded-lg bg-stone-50 border border-stone-100"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 text-left max-w-xs">
                    <div>{p.nome}</div>
                    <div className="text-[11px] font-normal text-stone-400 truncate">
                      {p.descricao_olfativa}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#FFD6F0] text-[#DD0088] font-semibold px-3 py-1 rounded-full text-[11px]">
                      {p.categoria?.nome || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {p.quantidade_estoque > 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        {p.quantidade_estoque} un.
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-semibold">
                        Esgotado (0)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#DD0088]">
                    {Number(p.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td className="py-3.5 px-4 space-x-2">
                    <button
                      onClick={() => abrirModal(p)}
                      className="border border-[#DD0088] text-[#DD0088] hover:bg-pink-50 px-4 py-1 rounded-full font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirProduto(p.id_produto)}
                      className="border border-red-400 text-red-600 hover:bg-red-50 px-4 py-1 rounded-full font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Criar/Editar Produto */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={salvarProduto}
            className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl my-8"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">
                {editando ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-stone-800">
                Nome do Perfume *
              </label>
              <input
                required
                placeholder="Ex: Rose Absolute Eau de Parfum"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#DD0088]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-stone-800">
                Descrição Olfativa
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Notas florais de rosas de Grasse com toques de baunilha e sândalo..."
                value={form.descricao_olfativa}
                onChange={(e) => setForm({ ...form, descricao_olfativa: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#DD0088]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-stone-800">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 249.90"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#DD0088]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-stone-800">
                  Quantidade em Estoque *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ex: 10"
                  value={form.quantidade_estoque}
                  onChange={(e) => setForm({ ...form, quantidade_estoque: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#DD0088]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-stone-800">
                Categoria *
              </label>
              <select
                required
                value={form.id_categoria}
                onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#DD0088]"
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* SEÇÃO DE FOTO DO PRODUTO (UPLOAD / TROCAR / REMOVER) */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60">
              <label className="block text-xs font-bold mb-2 text-stone-800">
                Foto do Produto (Upload para o servidor)
              </label>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border border-stone-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {form.imagem_url ? (
                    <img
                      src={formatImageUrl(form.imagem_url)}
                      alt="Prévia"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-stone-400 text-center px-1">
                      Sem foto
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="foto-upload"
                  />

                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="foto-upload"
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition ${
                        uploading
                          ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          : 'bg-[#DD0088] hover:bg-[#C4007A] text-white shadow-sm'
                      }`}
                    >
                      {uploading
                        ? 'Enviando foto...'
                        : form.imagem_url
                        ? 'Trocar foto'
                        : 'Selecionar foto do computador'}
                    </label>

                    {form.imagem_url && (
                      <button
                        type="button"
                        onClick={handleRemoverFoto}
                        className="px-3 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                      >
                        Remover foto
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-400">
                    Formatos aceitos: JPG, PNG, WEBP, GIF, SVG (máx. 5MB).
                  </p>
                </div>
              </div>

              {uploadError && (
                <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  {uploadError}
                </p>
              )}

              {/* Opção de inserir ou editar URL direta */}
              <div className="mt-3 pt-3 border-t border-stone-200">
                <label className="block text-[11px] text-stone-500 mb-1">
                  Ou digite diretamente a URL da imagem:
                </label>
                <input
                  type="text"
                  placeholder="https://exemplo.com/foto.jpg ou /uploads/..."
                  value={form.imagem_url}
                  onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl p-2 text-xs bg-white focus:outline-none focus:border-[#DD0088]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-5 py-2.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2.5 rounded-full bg-[#DD0088] hover:bg-[#C4007A] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
