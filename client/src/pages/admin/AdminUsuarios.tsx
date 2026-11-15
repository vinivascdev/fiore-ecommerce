import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminUsuarios: React.FC = () => {
  const { user: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busca, setBusca] = useState('');

  const carregar = async () => {
    const res = await fetch('http://localhost:3333/api/admin/usuarios', { credentials: 'include' });
    if (res.ok) setUsuarios(await res.json());
  };

  useEffect(() => {
    carregar();
  }, []);

  const alterarRole = async (id: number, novoTipo: 'CLIENTE' | 'ADMIN') => {
    const res = await fetch(`http://localhost:3333/api/admin/usuarios/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ tipo_usuario: novoTipo }),
    });

    if (res.ok) {
      carregar();
    } else {
      const err = await res.json();
      alert(err.message || 'Erro ao alterar permissão.');
    }
  };

  const excluirUsuario = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    const res = await fetch(`http://localhost:3333/api/admin/usuarios/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) carregar();
    else alert((await res.json()).message);
  };

  const filtrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-950">Gerenciamento de Usuários</h1>
        <p className="text-sm text-stone-600 mt-1">{usuarios.length} usuários cadastrados</p>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-full border border-[#DD0088] bg-white text-xs focus:outline-none"
        />
        <span className="absolute left-4 top-3 text-stone-500 text-sm">🔍</span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#FDF4FA] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-200">
              <th className="py-4 px-4">#ID</th>
              <th className="py-4 px-4">Nome</th>
              <th className="py-4 px-4">E-mail</th>
              <th className="py-4 px-4">Tipo / Permissão</th>
              <th className="py-4 px-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs">
            {filtrados.map((u) => {
              const eProprioAdmin = usuarioLogado?.id_usuario === u.id_usuario;
              return (
                <tr key={u.id_usuario} className="hover:bg-stone-50/70">
                  <td className="py-4 px-4 font-bold">#{u.id_usuario}</td>
                  <td className="py-4 px-4 font-bold text-stone-900">{u.nome}</td>
                  <td className="py-4 px-4">{u.email}</td>
                  <td className="py-4 px-4">
                    <select
                      value={u.tipo_usuario}
                      disabled={eProprioAdmin}
                      onChange={(e) => alterarRole(u.id_usuario, e.target.value as 'CLIENTE' | 'ADMIN')}
                      className={`px-3 py-1 rounded-full font-semibold cursor-pointer focus:outline-none ${
                        u.tipo_usuario === 'ADMIN'
                          ? 'bg-[#DD0088] text-white'
                          : 'bg-[#FFD6F0] text-[#DD0088]'
                      } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      <option value="CLIENTE" className="bg-white text-stone-900">
                        Cliente
                      </option>
                      <option value="ADMIN" className="bg-white text-stone-900">
                        Admin
                      </option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      disabled={eProprioAdmin}
                      onClick={() => excluirUsuario(u.id_usuario)}
                      className="border border-red-400 text-red-600 hover:bg-red-50 px-4 py-1 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};