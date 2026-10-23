import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans">
      {/* Banner Superior */}
      <div className="bg-[#FFB7E3] text-stone-900 text-xs font-semibold py-1.5 text-center tracking-wide">
        Frete grátis para todo o Brasil em compras acima de R$ 199! Aproveite.
      </div>

      {/* Bar de Navegação Principal */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-stone-900 tracking-tight">
          <svg className="w-6 h-6 text-stone-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a4 4 0 0 0-4 4c0 1.62.96 3.01 2.34 3.65C8.96 10.29 8 11.68 8 13.3c0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.62-.96-3.01-2.34-3.65C15.04 9.01 16 7.62 16 6a4 4 0 0 0-4-4zm0 18c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/>
          </svg>
          Fiore
        </Link>

        {/* Input de Busca */}
        <div className="flex-1 max-w-lg relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar produtos, marcas e categorias..."
            className="w-full bg-[#F3F4F6] text-sm text-stone-800 placeholder-gray-400 pl-9 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-4 text-xs">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">
                Olá, <strong className="text-stone-900">{user.nome}</strong>
              </span>
              <button
                onClick={logout}
                className="text-rose-600 hover:underline font-medium"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 text-stone-800 hover:text-black font-medium">
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Entrar <span className="text-gray-400 text-[10px]">(Cliente/Painel)</span>
              </Link>

              <Link
                to="/cadastro"
                className="bg-[#FFF0F7] text-[#D80075] hover:bg-[#FFE3F2] font-semibold px-4 py-2 rounded-md transition"
              >
                Cadastre-se
              </Link>
            </>
          )}

          {/* Botão de Carrinho */}
          <Link to="/carrinho" className="flex items-center gap-1.5 text-stone-800 font-medium pl-2 border-l border-gray-200">
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-[#D80075] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <span>Carrinho</span>
          </Link>
        </div>
      </div>
    </header>
  );
};