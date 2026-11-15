import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#FFB6E6] text-[#3B0729] font-semibold'
        : 'text-[#3B0729]/80 hover:bg-pink-50'
    }`;

  const inicial = user?.nome?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="min-h-screen flex bg-[#F7F7F8] font-sans text-stone-900">
      {/* Sidebar Esquerda */}
      <aside className="w-60 bg-white border-r border-stone-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Fiore */}
          <div className="px-6 py-5 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xl font-bold text-stone-950">
              <span className="text-2xl">✿</span> Fiore
            </div>
            <p className="text-xs text-stone-600 mt-0.5">Painel Administrativo</p>
          </div>

          {/* Menu */}
          <nav className="p-4 space-y-6">
            <div>
              <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-stone-900 mb-2">
                Geral
              </p>
              <NavLink to="/admin" end className={linkClass}>
                  <img
                src="/icons/dashboard.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  />
            Dashboard
              </NavLink>
            </div>

            <div>
              <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-stone-900 mb-2">
                Loja
              </p>
              <div className="space-y-1">
                <NavLink to="/admin/produtos" className={linkClass}>
                 <img
                src="/icons/produtos.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  /> Produtos
                </NavLink>
                <NavLink to="/admin/categorias" className={linkClass}>
                 <img
                src="/icons/categoriaTag.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  /> Categorias
                </NavLink>
                <NavLink to="/admin/pedidos" className={linkClass}>
                  <img
                src="/icons/pedido.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  /> Pedidos
                </NavLink>
              </div>
            </div>

            <div>
              <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-stone-900 mb-2">
                Gerenciamento
              </p>
              <div className="space-y-1">
                <NavLink to="/admin/usuarios" className={linkClass}>
                  <img
                src="/icons/usuarios.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  /> Usuários
                </NavLink>
                <NavLink to="/admin/relatorios" className={linkClass}>
                 <img
                src="/icons/relatorios.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  /> Relatórios
                </NavLink>
                <NavLink to="/admin/perfil" className={linkClass}>
                  <img
                src="/icons/settings.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
                  />Meus Dados
                </NavLink>
              </div>
            </div>
          </nav>
        </div>

        {/* Rodapé Admin */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#FFB6E6] flex items-center justify-center font-bold text-stone-900 shrink-0">
              {inicial}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-stone-900 truncate">{user?.nome}</p>
              <p className="text-[11px] text-stone-500">Administrador</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sair"
            className="p-2 text-stone-700 hover:text-[#DD0088] transition"
          >
            <img
      src="/icons/sair.svg"
      alt=""
      aria-hidden="true"
      className="h-5 w-5"
  />
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[73px] bg-white border-b border-stone-200 px-8 flex items-center justify-end">
          <button
            aria-label="Notificações"
            className="w-10 h-10 rounded-full border border-[#DD0088] flex items-center justify-center text-stone-800 hover:bg-pink-50 transition"
          >

                  <img
            src="/icons/notificacao.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
          />  

            
          </button>
        </header>

        {/* Conteúdo das Rotas Filhas */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};