import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { quantidadeItens } = useCarrinho();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [termoBusca, setTermoBusca] = useState(searchParams.get('busca') || '');

  useEffect(() => {
    setTermoBusca(searchParams.get('busca') || '');
  }, [searchParams]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = termoBusca.trim();
    if (termo) {
      navigate(`/?busca=${encodeURIComponent(termo)}`);
    } else {
      navigate('/');
    }
  };

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
            <svg width="23" height="32" viewBox="0 0 23 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 5.5C11.5 4.60999 11.7639 3.73996 12.2584 2.99994C12.7529 2.25991 13.4557 1.68314 14.2779 1.34254C15.1002 1.00195 16.005 0.912835 16.8779 1.08647C17.7508 1.2601 18.5526 1.68869 19.182 2.31802C19.8113 2.94736 20.2399 3.74918 20.4135 4.6221C20.5872 5.49501 20.4981 6.39981 20.1575 7.22208C19.8169 8.04434 19.2401 8.74715 18.5001 9.24162C17.76 9.73608 16.89 10 16 10M11.5 5.5C11.5 4.60999 11.2361 3.73996 10.7416 2.99994C10.2471 2.25991 9.54434 1.68314 8.72208 1.34254C7.89981 1.00195 6.99501 0.912835 6.1221 1.08647C5.24918 1.2601 4.44736 1.68869 3.81802 2.31802C3.18868 2.94736 2.7601 3.74918 2.58647 4.6221C2.41283 5.49501 2.50195 6.39981 2.84254 7.22208C3.18314 8.04434 3.75991 8.74715 4.49994 9.24162C5.23996 9.73608 6.10999 10 7 10M11.5 5.5V7M16 10C16.89 10 17.76 10.2639 18.5001 10.7584C19.2401 11.2529 19.8169 11.9557 20.1575 12.7779C20.4981 13.6002 20.5872 14.505 20.4135 15.3779C20.2399 16.2508 19.8113 17.0526 19.182 17.682C18.5526 18.3113 17.7508 18.7399 16.8779 18.9135C16.005 19.0872 15.1002 18.9981 14.2779 18.6575C13.4557 18.3169 12.7529 17.7401 12.2584 17.0001C11.7639 16.26 11.5 15.39 11.5 14.5M16 10H14.5M7 10C6.10999 10 5.23996 10.2639 4.49994 10.7584C3.75991 11.2529 3.18314 11.9557 2.84254 12.7779C2.50195 13.6002 2.41283 14.505 2.58647 15.3779C2.7601 16.2508 3.18868 17.0526 3.81802 17.682C4.44736 18.3113 5.24918 18.7399 6.1221 18.9135C6.99501 19.0872 7.89981 18.9981 8.72208 18.6575C9.54434 18.3169 10.2471 17.7401 10.7416 17.0001C11.2361 16.26 11.5 15.39 11.5 14.5M7 10H8.5M11.5 14.5V13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="black"/>
<path d="M14.5 10C14.5 11.6569 13.1569 13 11.5 13C9.84315 13 8.5 11.6569 8.5 10C8.5 8.34315 9.84315 7 11.5 7C13.1569 7 14.5 8.34315 14.5 10Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="black"/>
<path d="M11.5 13V31M11.5 31C17.8 31 22 28.4995 22 23.5C15.7 23.5 11.5 26.0005 11.5 31ZM11.5 31C5.2 31 1 28.4995 1 23.5C7.3 23.5 11.5 26.0005 11.5 31Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="black"/>
</svg>

            <span className="text-2xl font-bold tracking-tight text-stone-900">Fiore</span>
          </Link>

          {/* Busca */}
          <form
            onSubmit={handleBusca}
            className="hidden md:flex flex-1 max-w-[480px] items-center gap-2 h-10 px-3 bg-[#F8F9FB] border border-stone-200 rounded-md focus-within:border-[#DD0088] transition-colors"
          >
            <button type="submit" aria-label="Buscar" className="text-stone-500 hover:text-[#DD0088] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <input
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar produtos, marcas e categorias..."
              className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </form>

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
