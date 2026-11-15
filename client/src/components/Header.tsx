import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { quantidadeItens } = useCarrinho();
  const navigate = useNavigate();

  const isAdmin = user?.tipo_usuario === 'ADMIN';
  const primeiroNome = user?.nome?.split(' ')[0];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="w-full">
      {/* Faixa promocional */}
      <div className="bg-[#FFB6E6] text-center text-xs text-stone-900 py-2 px-4">
        Frete grátis para todo o Brasil em compras acima de R$ 199! Aproveite.
      </div>

      {/* Barra principal */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-[1280px] mx-auto flex items-center gap-4 md:gap-8 px-4 md:px-8 h-[74px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="14" cy="7" r="4.5" />
              <circle cx="7.5" cy="13" r="4.5" />
              <circle cx="20.5" cy="13" r="4.5" />
              <circle cx="14" cy="17" r="4" />
              <path d="M14 21v6M6 31c4-1 6-3 8-4 2 1 4 3 8 4" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-stone-900">Fiore</span>
          </Link>

          {/* Busca */}
          <div className="hidden md:flex flex-1 max-w-[480px] items-center gap-2 h-10 px-3 bg-[#F8F9FB] border border-stone-200 rounded-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Buscar produtos, marcas e categorias..."
              className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {/* Ações */}
          <nav className="ml-auto flex items-center gap-3 md:gap-5 text-sm">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/minha-conta'}
                  className="flex items-center gap-2 text-stone-900 font-medium hover:text-[#DD0088] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  <span>Olá, {primeiroNome}</span>
                  {isAdmin ? (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFD6F0] text-[#DD0088]">
                      Admin
                    </span>
                  ) : (
                    <span className="hidden sm:inline text-[11px] font-normal text-stone-400">
                      (Minha conta)
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-[#FFF0F7] text-[#DD0088] font-semibold hover:bg-[#FFD6F0] transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-stone-900 font-medium hover:text-[#DD0088] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  Entrar
                  <span className="hidden sm:inline text-[11px] font-normal text-stone-400">(Cliente/Painel)</span>
                </Link>

                <Link to="/cadastro" className="px-4 py-2 rounded-md bg-[#FFF0F7] text-[#DD0088] font-semibold hover:bg-[#FFD6F0] transition-colors">
                  Cadastre-se
                </Link>
              </>
            )}

            <span className="hidden sm:block w-px h-8 bg-stone-200" />

            <Link to="/carrinho" className="relative flex items-center gap-2 text-stone-900 font-medium hover:text-[#DD0088] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="20" r="1.3" />
                <circle cx="18" cy="20" r="1.3" />
                <path d="M2 3h3l2.5 12h11L21 7H6" />
              </svg>
              Carrinho
              {quantidadeItens > 0 && (
                <span className="absolute -top-2 left-3 min-w-[16px] h-4 px-1 rounded-full bg-[#DD0088] text-white text-[10px] leading-4 text-center">
                  {quantidadeItens}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
