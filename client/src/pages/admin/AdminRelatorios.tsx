import React, { useEffect, useState } from 'react';

type TipoRelatorio = 'compras-por-cliente' | 'receita-por-dia' | 'produtos-em-falta';

export const AdminRelatorios: React.FC = () => {
  const [tipo, setTipo] = useState<TipoRelatorio>('compras-por-cliente');
  const [dataInicio, setDataInicio] = useState('2025-01-01');
  const [dataFim, setDataFim] = useState('2026-12-31');
  const [formato, setFormato] = useState<'HTML' | 'TXT'>('HTML');
  const [dados, setDados] = useState<any[]>([]);

  const carregarRelatorio = async () => {
    const params = new URLSearchParams({ tipo, dataInicio, dataFim });
    const res = await fetch(`http://localhost:3333/api/admin/relatorios?${params}`, {
      credentials: 'include',
    });
    if (res.ok) setDados(await res.json());
  };

  useEffect(() => {
    carregarRelatorio();
  }, [tipo, dataInicio, dataFim]);

  const exportarRelatorio = () => {
    if (formato === 'HTML') {
      window.print();
      return;
    }

    let conteudo = `RELATÓRIO GERENCIAL FIORE - ${tipo.toUpperCase()}\nPeríodo: ${dataInicio} a ${dataFim}\n----------------------------------------\n`;
    dados.forEach((item, idx) => {
      if (tipo === 'compras-por-cliente') {
        conteudo += `#${idx + 1} ${item.nome} - ${item.totalPedidos} pedidos (R$ ${item.valorTotal.toFixed(2)})\n`;
      } else if (tipo === 'receita-por-dia') {
        conteudo += `${item.data}: R$ ${item.total.toFixed(2)}\n`;
      } else {
        conteudo += `#${idx + 1} ${item.nome} (${item.categoria?.nome}) - Valor: R$ ${item.preco} - ESGOTADO\n`;
      }
    });

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipo}.txt`;
    a.click();
  };

  const maxReceita =
    tipo === 'receita-por-dia' ? Math.max(...dados.map((d) => d.total || 0), 1) : 1;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-950">Relatórios Gerenciais</h1>
        <p className="text-sm text-stone-600 mt-1">
          Selecione o tipo de relatório, o período e o formato de exportação.
        </p>
      </div>

      {/* 3 Cards de Seleção */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button
          type="button"
          onClick={() => setTipo('compras-por-cliente')}
          className={`text-left bg-white p-5 rounded-2xl border-2 transition ${tipo === 'compras-por-cliente' ? 'border-[#DD0088]' : 'border-stone-200'
            }`}
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/cliente.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="font-bold text-sm text-stone-900">Compras por clientes</p>
          <p className="text-xs text-stone-500 mt-1">
            Total de pedidos por cliente no período, ordenado por volume.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTipo('receita-por-dia')}
          className={`text-left bg-white p-5 rounded-2xl border-2 transition ${tipo === 'receita-por-dia' ? 'border-[#DD0088]' : 'border-stone-200'
            }`}
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/receita.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="font-bold text-sm text-stone-900">Receita por dia</p>
          <p className="text-xs text-stone-500 mt-1">
            Valor monetário total de compras agrupado por data.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTipo('produtos-em-falta')}
          className={`text-left bg-white p-5 rounded-2xl border-2 transition ${tipo === 'produtos-em-falta' ? 'border-[#DD0088]' : 'border-stone-200'
            }`}
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD6F0]">
            <img
              src="/icons/estoque.svg"
              alt=""
              aria-hidden="true"
              className="h-15 w- 15"
            />
          </div>
          <p className="font-bold text-sm text-stone-900">Produtos em falta</p>
          <p className="text-xs text-stone-500 mt-1">
            Produtos com estoque zerado, ordenados por descrição.
          </p>
        </button>
      </div>

      {/* Parâmetros do Relatório */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-xs font-bold text-stone-900 mb-4">⚙️ Parâmetros do Relatório</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-[11px] font-bold mb-1">Data Inicial</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="h-10 px-4 rounded-full border border-[#DD0088] text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1">Data Final</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="h-10 px-4 rounded-full border border-[#DD0088] text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1">Formato de Exportação</label>
            <div className="flex gap-2">
              {(['HTML', 'TXT'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormato(fmt)}
                  className={`h-10 px-5 rounded-full text-xs font-bold border ${formato === fmt
                      ? 'border-[#DD0088] text-[#DD0088] bg-pink-50/50'
                      : 'border-stone-300 text-stone-600'
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={exportarRelatorio}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-[#DD0088] px-6 text-xs font-bold text-white transition hover:bg-[#C4007A]"
          >
            <img
              src="/icons/download.svg"
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            Emitir Relatório
          </button>
        </div>
      </div>

      {/* Resultado do Relatório */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="font-bold text-sm text-stone-900">
            {tipo === 'compras-por-cliente' && 'Compras por cliente'}
            {tipo === 'receita-por-dia' && 'Receitas por dia'}
            {tipo === 'produtos-em-falta' && 'Produtos em Falta'}
          </h3>
          <p className="text-xs text-stone-400">
            Período: {dataInicio} a {dataFim}
          </p>
        </div>

        <div className="divide-y divide-stone-100">
          {tipo === 'compras-por-cliente' &&
            dados.map((item, idx) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FFD6F0] text-[#DD0088] font-bold text-xs flex items-center justify-center">
                    {item.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{item.nome}</p>
                    <p className="text-xs text-stone-400">#{String(idx + 1).padStart(2, '0')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#DD0088]">{item.totalPedidos} pedidos</span>
              </div>
            ))}

          {tipo === 'receita-por-dia' &&
            dados.map((item) => (
              <div key={item.data} className="px-6 py-4 flex items-center gap-6">
                <span className="text-xs font-bold text-stone-900 w-24">{item.data}</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8AD4] rounded-full"
                    style={{ width: `${(item.total / maxReceita) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#DD0088] w-24 text-right">
                  {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}

          {tipo === 'produtos-em-falta' &&
            dados.map((prod, idx) => (
              <div key={prod.id_produto} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-stone-400">#{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{prod.nome}</p>
                    <p className="text-xs text-stone-400">{prod.descricao_olfativa}</p>
                  </div>
                </div>
                <span className="text-xs text-stone-600">{prod.categoria?.nome}</span>
                <span className="text-xs font-semibold text-stone-800">
                  Valor: {Number(prod.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-xs font-bold text-[#DD0088]">ESGOTADO</span>
              </div>
            ))}

          {dados.length === 0 && (
            <p className="p-8 text-center text-xs text-stone-400">
              Nenhum registro encontrado para os filtros selecionados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};