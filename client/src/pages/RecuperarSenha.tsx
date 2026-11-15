import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const inputClass =
  'w-full h-[50px] px-4 bg-[#F2F2F2] border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#DD0088] focus:ring-2 focus:ring-[#DD0088]/20';
const labelClass = 'block text-xs text-stone-800 mb-2 ml-4';

export const RecuperarSenha: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3333/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao verificar o e-mail.');
      }

      setStep(2);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está ativo.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3333/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao redefinir a senha.');
      }

      setSuccess('Senha alterada com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex items-center justify-center p-6 md:py-16 bg-white overflow-hidden">
      {/* Forma rosa de fundo */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 920"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 880 C220 860 350 720 400 650 C440 600 470 560 500 520 L500 200 L945 200 C1100 150 1300 125 1440 130 L1440 920 L0 920 Z"
          fill="#FFB6E6"
        />
      </svg>

      <div className="relative w-full max-w-[460px] bg-[#F8F9FB] rounded-[40px] shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-stone-200 px-[42px] py-12">
        <h1 className="text-4xl font-bold text-center text-[#0F172A] tracking-tight mb-3">
          Recuperar Senha
        </h1>
        <p className="text-center text-xs text-stone-600 mb-8">
          {step === 1
            ? 'Informe o e-mail cadastrado na sua conta Fiore para redefinir sua senha.'
            : `Crie uma nova senha para ${email}`}
        </p>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="bg-emerald-50 border border-emerald-300 text-emerald-700 text-sm p-3 rounded-md mb-4">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyEmail}>
            <label htmlFor="email-rec" className={labelClass}>
              E-mail cadastrado
            </label>
            <input
              id="email-rec"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: carolinda@gmail.com"
              className={inputClass}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] mt-7 bg-[#DD0088] hover:bg-[#C4007A] text-white font-semibold rounded-[3px] transition-colors disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label htmlFor="nova-senha" className={labelClass}>
              Nova senha
            </label>
            <div className="relative">
              <input
                id="nova-senha"
                type={showSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className={`${inputClass} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  {showSenha && <path d="M3 3l18 18" />}
                </svg>
              </button>
            </div>

            <label htmlFor="confirmar-senha" className={`${labelClass} mt-5`}>
              Confirmar nova senha
            </label>
            <input
              id="confirmar-senha"
              type={showSenha ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha"
              className={inputClass}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] mt-7 bg-[#DD0088] hover:bg-[#C4007A] text-white font-semibold rounded-[3px] transition-colors disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>
        )}

        <hr className="my-7 border-stone-200" />

        <p className="text-center text-sm text-stone-900">
          Lembrou a senha?{' '}
          <Link to="/login" className="text-[#0A7AFF] hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
};