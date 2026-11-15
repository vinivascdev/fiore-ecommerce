import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ProdutoCarrinho {
  id_produto: number;
  nome: string;
  descricao_olfativa: string;
  preco: number | string;
  quantidade_estoque: number;
  imagem_url?: string;
}

export interface ItemCarrinho {
  produto: ProdutoCarrinho;
  quantidade: number;
}

interface CarrinhoContextValue {
  itens: ItemCarrinho[];
  quantidadeItens: number;
  adicionar: (produto: ProdutoCarrinho) => boolean;
  atualizarQuantidade: (idProduto: number, quantidade: number) => void;
  remover: (idProduto: number) => void;
  limpar: () => void;
}

const STORAGE_KEY = 'fiore-carrinho';
const CarrinhoContext = createContext<CarrinhoContextValue | null>(null);

function carregarCarrinho(): ItemCarrinho[] {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

export const CarrinhoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinho);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  const adicionar = (produto: ProdutoCarrinho) => {
    const existente = itens.find((item) => item.produto.id_produto === produto.id_produto);
    if (existente && existente.quantidade >= produto.quantidade_estoque) return false;
    if (!existente && produto.quantidade_estoque < 1) return false;

    setItens((atuais) =>
      existente
        ? atuais.map((item) =>
            item.produto.id_produto === produto.id_produto
              ? { ...item, produto, quantidade: item.quantidade + 1 }
              : item
          )
        : [...atuais, { produto, quantidade: 1 }]
    );
    return true;
  };

  const atualizarQuantidade = (idProduto: number, quantidade: number) => {
    setItens((atuais) =>
      atuais
        .map((item) =>
          item.produto.id_produto === idProduto
            ? {
                ...item,
                quantidade: Math.max(1, Math.min(Math.floor(quantidade), item.produto.quantidade_estoque)),
              }
            : item
        )
        .filter((item) => item.produto.quantidade_estoque > 0)
    );
  };

  const remover = (idProduto: number) =>
    setItens((atuais) => atuais.filter((item) => item.produto.id_produto !== idProduto));

  const limpar = () => setItens([]);

  const quantidadeItens = itens.reduce((total, item) => total + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, quantidadeItens, adicionar, atualizarQuantidade, remover, limpar }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider.');
  return context;
}
