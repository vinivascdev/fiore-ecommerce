import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    login: '',
    senha: '',
    endereco: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao realizar o cadastro.');
      }

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-stone-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-stone-800 p-8 rounded-xl shadow-lg border border-amber-900/40">
        <h2 className="text-3xl font-serif text-center mb-1 text-amber-300">Fiore Perfumes</h2>
        <p className="text-stone-400 text-center mb-6 text-sm">Crie sua conta de cliente</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 text-sm p-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1">Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1">Usuário (Login)</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1">Senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1">Endereço de Entrega</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold py-2.5 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="mt-4 text-center text-xs text-stone-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-amber-400 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
};