import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginInput, senhaInput);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-stone-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-stone-800 p-8 rounded-xl shadow-lg border border-amber-900/40">
        <h2 className="text-3xl font-serif text-center mb-2 text-amber-300">Fiore Perfumes</h2>
        <p className="text-stone-400 text-center mb-6 text-sm">Acesse sua conta para continuar</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
            Login ou E-mail
          </label>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            className="w-full px-4 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            className="w-full px-4 py-2 bg-stone-700 border border-stone-600 rounded text-stone-100 focus:outline-none focus:border-amber-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold py-2.5 rounded transition duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};