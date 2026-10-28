import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Salve a foto dos perfumes em: public/images/perfumes-login.jpg
const LOGIN_IMAGE = '/images/perfumes-login.jpg';

const inputClass =
  'w-full h-[50px] px-4 bg-[#F2F2F2] border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#DD0088] focus:ring-2 focus:ring-[#DD0088]/20';

export const Login: React.FC = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  // const [lembrar, setLembrar] = useState(false); // ainda não enviado ao AuthContext
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginInput, senhaInput);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 grid md:grid-cols-2 bg-white">
      {/* Imagem */}
      <div className="hidden md:block bg-[#EDEDED] relative">
        <img
          src={LOGIN_IMAGE}
          alt="Perfumes Fiore"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Formulário */}
      <div className="relative flex items-center justify-center p-6 md:p-10 overflow-hidden">
        {/* Forma rosa de fundo */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 720 920"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 225 C140 285 250 430 340 590 C430 750 600 800 720 810 L720 920 L0 920 Z" fill="#FFB6E6" />
          <path d="M470 790 C560 850 640 880 720 885 L720 790 Z" fill="#FFFFFF" />
        </svg>

        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[494px] bg-[#F8F9FB] rounded-[40px] shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-stone-200 px-[55px] py-14"
        >
          <h1 className="text-5xl font-bold text-center text-[#0F172A] tracking-tight mb-12">
            Bem-Vindo!
          </h1>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <label htmlFor="login" className="block text-xs text-stone-800 mb-2 ml-4">Login</label>
          <input
            id="login"
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="E-mail ou Telefone"
            className={inputClass}
            required
          />

          <label htmlFor="senha" className="block text-xs text-stone-800 mt-5 mb-2 ml-4">Senha</label>
          <div className="relative">
            <input
              id="senha"
              type={showSenha ? 'text' : 'password'}
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              placeholder="Digite a senha"
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowSenha((v) => !v)}
              aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700"
            >
              <EyeIcon off={showSenha} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-5 text-sm">
            {/* <label className="flex items-center gap-3 cursor-pointer text-stone-800">
              <button
                type="button"
                role="switch"
                aria-checked={lembrar}
                onClick={() => setLembrar((v) => !v)}
                className={`relative w-10 h-6 rounded-full border transition-colors ${
                  lembrar ? 'bg-[#DD0088] border-[#DD0088]' : 'bg-[#EDEDED] border-stone-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    lembrar ? 'translate-x-4' : ''
                  }`}
                />
              </button>
              Lembrar senha
            </label> */}
            <Link to="/recuperar-senha" className="text-[#0A7AFF] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[42px] mt-8 bg-[#DD0088] hover:bg-[#C4007A] text-white font-semibold rounded-[3px] transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <hr className="my-8 border-stone-200" />

          <p className="mt-10 text-center text-sm text-stone-900">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-[#0A7AFF] hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const EyeIcon: React.FC<{ off?: boolean }> = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);