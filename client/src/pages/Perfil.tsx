import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface DadosPerfil {
  nome: string;
  sobrenome: string;
  email: string;
  login: string; // não aparece na tela, mas continua sendo enviado ao salvar
  cpf: string;
  genero: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
}

const dadosVazios: DadosPerfil = {
  nome: '',
  sobrenome: '',
  email: '',
  login: '',
  cpf: '',
  genero: '',
  telefone: '',
  dataNascimento: '',
  endereco: '',
};

function normalizar(origem: Partial<DadosPerfil> | undefined): DadosPerfil {
  return {
    nome: origem?.nome ?? '',
    sobrenome: origem?.sobrenome ?? '',
    email: origem?.email ?? '',
    login: origem?.login ?? '',
    cpf: origem?.cpf ?? '',
    genero: origem?.genero ?? '',
    telefone: origem?.telefone ?? '',
    dataNascimento: origem?.dataNascimento ?? '',
    endereco: origem?.endereco ?? '',
  };
}

type Campo = {
  chave: keyof DadosPerfil;
  rotulo: string;
  tipo: string;
  obrigatorio?: boolean;
  larguraTotal?: boolean;
};

const camposSobre: Campo[] = [
  { chave: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true, larguraTotal: true },
  { chave: 'nome', rotulo: 'Nome', tipo: 'text', obrigatorio: true },
  { chave: 'sobrenome', rotulo: 'Sobrenome', tipo: 'text' },
  { chave: 'cpf', rotulo: 'CPF', tipo: 'text' },
  { chave: 'genero', rotulo: 'Gênero', tipo: 'text' },
  { chave: 'telefone', rotulo: 'Telefone', tipo: 'tel' },
  { chave: 'dataNascimento', rotulo: 'Data de nascimento', tipo: 'text' },
];

const camposEndereco: Campo[] = [
  { chave: 'endereco', rotulo: 'Endereço', tipo: 'text', larguraTotal: true },
];

const estiloInput =
  'h-8 w-full rounded-xl border border-[#E6007E] bg-[#FAFAFA] px-3 text-xs text-stone-900 outline-none transition placeholder:text-stone-400 focus:ring-2 focus:ring-pink-200';

const estiloRotulo = 'mb-1 block text-[11px] font-bold uppercase text-black';

type Aba = 'dados' | 'pedidos';

interface DadosSenha {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

const senhaVazia: DadosSenha = {
  senhaAtual: '',
  novaSenha: '',
  confirmarSenha: '',
};

export function Perfil() {
  // Ajuste "logout" para o nome que existe no seu AuthContext
  const { user, logout } = useAuth() as ReturnType<typeof useAuth> & {
    logout?: () => void;
  };

  const [aba, setAba] = useState<Aba>('dados');
  const [dados, setDados] = useState<DadosPerfil>(dadosVazios);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  // Alteração de senha
  const [senha, setSenha] = useState<DadosSenha>(senhaVazia);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);

  // Exclusão de conta
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const resposta = await fetch('http://localhost:3333/api/usuarios/me', {
          credentials: 'include',
        });

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar seu perfil.');
        }

        const resultado = await resposta.json();
        const usuario = resultado.usuario ?? resultado.user;

        if (usuario) {
          setDados(normalizar(usuario));
        } else if (user) {
          setDados(normalizar(user as Partial<DadosPerfil>));
        }
      } catch {
        // Usa os dados da sessão caso a rota de consulta ainda não exista.
        if (user) {
          setDados(normalizar(user as Partial<DadosPerfil>));
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [user]);

  // Fecha o modal de exclusão com a tecla Esc
  useEffect(() => {
    if (!confirmandoExclusao) return;

    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !excluindo) {
        setConfirmandoExclusao(false);
      }
    }

    window.addEventListener('keydown', aoPressionarTecla);
    return () => window.removeEventListener('keydown', aoPressionarTecla);
  }, [confirmandoExclusao, excluindo]);

  function atualizarCampo(campo: keyof DadosPerfil, valor: string) {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function atualizarSenha(campo: keyof DadosSenha, valor: string) {
    setSenha((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function salvarPerfil(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem('');
    setErro(false);
    setSalvando(true);

    try {
      const resposta = await fetch('http://localhost:3333/api/usuarios/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem ||
            resultado.message ||
            'Não foi possível salvar as alterações.'
        );
      }

      setMensagem(resultado.mensagem || 'Dados atualizados com sucesso!');
    } catch (erroRecebido) {
      setErro(true);
      setMensagem(
        erroRecebido instanceof Error
          ? erroRecebido.message
          : 'Ocorreu um erro ao salvar seus dados.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alterarSenha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagemSenha('');
    setErroSenha(false);

    if (senha.novaSenha.length < 6) {
      setErroSenha(true);
      setMensagemSenha('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha.novaSenha !== senha.confirmarSenha) {
      setErroSenha(true);
      setMensagemSenha('A confirmação não é igual à nova senha.');
      return;
    }

    setSalvandoSenha(true);

    try {
      const resposta = await fetch(
        'http://localhost:3333/api/usuarios/me/senha',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            senhaAtual: senha.senhaAtual,
            novaSenha: senha.novaSenha,
          }),
        }
      );

      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem ||
            resultado.message ||
            'Não foi possível alterar a senha.'
        );
      }

      setMensagemSenha(resultado.mensagem || 'Senha alterada com sucesso!');
      setSenha(senhaVazia);
    } catch (erroRecebido) {
      setErroSenha(true);
      setMensagemSenha(
        erroRecebido instanceof Error
          ? erroRecebido.message
          : 'Ocorreu um erro ao alterar a senha.'
      );
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function excluirConta() {
    setErroExclusao('');
    setExcluindo(true);

    try {
      const resposta = await fetch('http://localhost:3333/api/usuarios/me', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!resposta.ok) {
        const resultado = await resposta.json().catch(() => ({}));
        throw new Error(
          resultado.mensagem ||
            resultado.message ||
            'Não foi possível excluir a conta.'
        );
      }

      setConfirmandoExclusao(false);
      logout?.();
    } catch (erroRecebido) {
      setErroExclusao(
        erroRecebido instanceof Error
          ? erroRecebido.message
          : 'Ocorreu um erro ao excluir a conta.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-[#F5F5F5] p-8">
        <p className="text-sm text-stone-500">Carregando seu perfil...</p>
      </div>
    );
  }

  const nomeExibido = dados.nome || user?.nome || '';
  const inicial = nomeExibido.charAt(0).toUpperCase() || 'U';

  function renderCampos(campos: Campo[]) {
    return (
      <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
        {campos.map((campo) => (
          <div
            key={campo.chave}
            className={campo.larguraTotal ? 'sm:col-span-2' : ''}
          >
            <label htmlFor={campo.chave} className={estiloRotulo}>
              {campo.rotulo}
            </label>
            <input
              id={campo.chave}
              type={campo.tipo}
              value={dados[campo.chave]}
              onChange={(e) => atualizarCampo(campo.chave, e.target.value)}
              required={campo.obrigatorio}
              className={estiloInput}
            />
          </div>
        ))}
      </div>
    );
  }

  const itemMenu = (ativo: boolean) =>
    `w-full rounded-full px-3.5 py-2 text-left text-sm text-[#4A0F3D] transition ${
      ativo ? 'bg-[#FFB8DE]' : 'hover:bg-pink-50'
    }`;

  return (
    // Se existir um header/navbar acima desta página, troque h-screen por
    // h-[calc(100vh-ALTURA_DO_HEADER)] para não gerar rolagem na página.
    <div className="flex h-screen flex-1 overflow-hidden bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="hidden w-[180px] shrink-0 flex-col justify-between border-r border-stone-200 bg-white md:flex">
        <div className="px-4 pt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-xs font-medium text-[#E6007E] hover:opacity-80"
          >
            <span aria-hidden>←</span> Voltar
          </button>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase text-black">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M6.17 18.5a7 7 0 0 1 11.66 0" />
            </svg>
            Minha conta
          </div>

          <nav className="-mx-2 mt-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setAba('dados')}
              aria-current={aba === 'dados' ? 'page' : undefined}
              className={itemMenu(aba === 'dados')}
            >
              Dados Pessoais
            </button>
            <button
              type="button"
              onClick={() => setAba('pedidos')}
              aria-current={aba === 'pedidos' ? 'page' : undefined}
              className={itemMenu(aba === 'pedidos')}
            >
              Meus Pedidos
            </button>
          </nav>
        </div>

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFB8DE] text-base font-medium text-black">
              {inicial}
            </span>
            <span className="text-xs font-bold text-black">
              {nomeExibido.split(' ')[0]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => logout?.()}
            aria-label="Sair"
            className="text-black hover:opacity-70"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {aba === 'dados' ? (
          <div className="mx-auto max-w-3xl">
            <form onSubmit={salvarPerfil}>
              {/* Título */}
              <div className="mb-3">
                <h1 className="text-base font-semibold text-black">
                  Dados Pessoais
                </h1>
                <p className="text-xs text-stone-500">
                  Mantenha suas informações atualizadas.
                </p>
              </div>

              {/* Card: Sobre */}
              <section className="rounded-2xl border border-stone-300 px-5 py-4">
                <h2 className="mb-3 text-sm font-medium text-black">Sobre</h2>
                {renderCampos(camposSobre)}
              </section>

              {/* Card: Endereço */}
              <section className="mt-3 rounded-2xl border border-stone-300 px-5 py-4">
                <h2 className="mb-3 text-sm font-medium text-black">
                  Endereço
                </h2>
                {renderCampos(camposEndereco)}
              </section>

              {mensagem && (
                <div
                  role="status"
                  className={`mt-3 rounded-xl px-4 py-2 text-xs ${
                    erro
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {mensagem}
                </div>
              )}

              {/* Botões: excluir conta + salvar */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setErroExclusao('');
                    setConfirmandoExclusao(true);
                  }}
                  className="rounded-full border border-[#E6007E] bg-white px-5 py-2.5 text-xs font-semibold text-[#E6007E] transition hover:bg-pink-50"
                >
                  Excluir conta
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="rounded-full bg-[#E6007E] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C4006C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>

            {/* Card: Alterar senha */}
            <form
              onSubmit={alterarSenha}
              className="mb-2 mt-6 rounded-2xl border border-stone-300 px-5 py-4"
            >
              <h2 className="mb-3 text-sm font-medium text-black">
                Alterar senha
              </h2>

              <div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="senhaAtual" className={estiloRotulo}>
                    Senha atual
                  </label>
                  <input
                    id="senhaAtual"
                    type="password"
                    autoComplete="current-password"
                    value={senha.senhaAtual}
                    onChange={(e) =>
                      atualizarSenha('senhaAtual', e.target.value)
                    }
                    required
                    className={estiloInput}
                  />
                </div>

                <div>
                  <label htmlFor="novaSenha" className={estiloRotulo}>
                    Nova senha
                  </label>
                  <input
                    id="novaSenha"
                    type="password"
                    autoComplete="new-password"
                    value={senha.novaSenha}
                    onChange={(e) =>
                      atualizarSenha('novaSenha', e.target.value)
                    }
                    required
                    className={estiloInput}
                  />
                </div>

                <div>
                  <label htmlFor="confirmarSenha" className={estiloRotulo}>
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    autoComplete="new-password"
                    value={senha.confirmarSenha}
                    onChange={(e) =>
                      atualizarSenha('confirmarSenha', e.target.value)
                    }
                    required
                    className={estiloInput}
                  />
                </div>
              </div>

              {mensagemSenha && (
                <div
                  role="status"
                  className={`mt-3 rounded-xl px-4 py-2 text-xs ${
                    erroSenha
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {mensagemSenha}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={salvandoSenha}
                  className="rounded-full bg-[#E6007E] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C4006C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvandoSenha ? 'Alterando...' : 'Alterar senha'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-3 text-base font-semibold text-black">
              Meus Pedidos
            </h1>

            <section className="flex flex-col items-center justify-center rounded-2xl border border-stone-300 px-5 py-14 text-center">
              <svg
                className="h-10 w-10 text-[#E6007E]/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="mt-3 text-sm font-medium text-black">
                Você ainda não fez nenhum pedido
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Quando você comprar, seus pedidos aparecerão aqui.
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Modal de confirmação de exclusão de conta */}
      {confirmandoExclusao && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => !excluindo && setConfirmandoExclusao(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-excluir"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="titulo-excluir"
              className="text-base font-semibold text-black"
            >
              Tem certeza de que deseja excluir sua conta?
            </h2>
            <p className="mt-2 text-xs text-stone-500">
              Essa ação é permanente e não poderá ser desfeita.
            </p>

            {erroExclusao && (
              <div className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700">
                {erroExclusao}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                disabled={excluindo}
                onClick={() => setConfirmandoExclusao(false)}
                className="rounded-full border border-stone-300 px-5 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={excluindo}
                onClick={excluirConta}
                className="rounded-full bg-[#E6007E] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#C4006C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {excluindo ? 'Excluindo...' : 'Excluir conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}