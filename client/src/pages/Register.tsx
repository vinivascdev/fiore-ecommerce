import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const inputClass =
  'w-full h-[50px] px-4 bg-[#F2F2F2] border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#DD0088] focus:ring-2 focus:ring-[#DD0088]/20';
const labelClass = 'block text-xs text-stone-800 mb-2 ml-4';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '', // Adicionado estado para endereço
    senha: '',
  });
  const [showSenha, setShowSenha] = useState(false);
  const [aceite, setAceite] = useState(false);
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

    if (!aceite) {
      setError('Aceite os Termos de Uso e a Política de Privacidade para continuar.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: `${formData.nome} ${formData.sobrenome}`.trim(),
        email: formData.email,
        telefone: formData.telefone,
        login: formData.email,
        senha: formData.senha,
        endereco: formData.endereco, // Envia o endereço preenchido
      };

      const res = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // Trata tanto data.mensagem quanto data.message do backend
      if (!res.ok) throw new Error(data.mensagem || data.message || 'Erro ao realizar o cadastro.');

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
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

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[450px] bg-[#F8F9FB] rounded-[40px] shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-stone-200 px-[39px] py-10"
      >
        <h1 className="text-5xl font-bold text-center text-[#0F172A] tracking-tight mb-10">
          Crie uma Conta
        </h1>

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

        <div className="grid grid-cols-[1fr_1.3fr] gap-4">
          <div>
            <label htmlFor="nome" className={labelClass}>Nome</label>
            <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} placeholder="Ex: Yasmin" className={inputClass} required />
          </div>
          <div>
            <label htmlFor="sobrenome" className={labelClass}>Sobrenome</label>
            <input id="sobrenome" name="sobrenome" type="text" value={formData.sobrenome} onChange={handleChange} placeholder="Ex: da Silva Melo" className={inputClass} required />
          </div>
        </div>

        <label htmlFor="email" className={`${labelClass} mt-5`}>E-mail</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: carolinda@gmail.com" className={inputClass} required />

        <label htmlFor="telefone" className={`${labelClass} mt-5`}>Telefone</label>
        <input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="Ex: 85997343140" className={inputClass} required />

        {/* NOVO CAMPO: Endereço */}
        <label htmlFor="endereco" className={`${labelClass} mt-5`}>Endereço</label>
        <input id="endereco" name="endereco" type="text" value={formData.endereco} onChange={handleChange} placeholder="Ex: Rua das Flores, 123" className={inputClass} required />

        <label htmlFor="senha" className={`${labelClass} mt-5`}>Senha</label>
        <div className="relative">
          <input
            id="senha"
            name="senha"
            type={showSenha ? 'text' : 'password'}
            value={formData.senha}
            onChange={handleChange}
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              {showSenha && <path d="M3 3l18 18" />}
            </svg>
          </button>
        </div>

        <label className="flex items-start gap-3 mt-6 text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            className="mt-1 w-5 h-5 shrink-0 rounded border-stone-400 accent-[#DD0088]"
          />
          <span className="text-[15px] leading-snug">
            Li, aceito os{' '}
            <Link to="/termos" className="text-blue-700 underline">Termos de Uso</Link> e estou
            ciente da{' '}
            <Link to="/privacidade" className="text-blue-700 underline">Política de Privacidade</Link>.
          </span>
        </label>

        <p className="mt-6 text-[15px] text-stone-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-blue-700 hover:underline">Fazer login</Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[42px] mt-5 bg-[#DD0088] hover:bg-[#C4007A] text-white font-semibold rounded-[3px] transition-colors disabled:opacity-60"
        >
          {loading ? 'Criando...' : 'Criar'}
        </button>
      </form>
    </div>
  );
};