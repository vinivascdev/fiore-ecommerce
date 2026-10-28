
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface DadosPerfil {
  nome: string;
  email: string;
  login: string;
  endereco: string;
}

export function Perfil() {
  const { user } = useAuth();

  const [dados, setDados] = useState<DadosPerfil>({
    nome: '',
    email: '',
    login: '',
    endereco: '',
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const resposta = await fetch(
          'http://localhost:3333/api/usuarios/me',
          { credentials: 'include' }
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar seu perfil.');
        }

        const resultado = await resposta.json();
        const usuario = resultado.usuario ?? resultado.user;

        if (usuario) {
          setDados({
            nome: usuario.nome ?? '',
            email: usuario.email ?? '',
            login: usuario.login ?? '',
            endereco: usuario.endereco ?? '',
          });
        } else if (user) {
          setDados({
            nome: user.nome ?? '',
            email: user.email ?? '',
            login: user.login ?? '',
            endereco: '',
          });
        }
      } catch {
        // Usa os dados da sessão caso a rota de consulta ainda não exista.
        if (user) {
          setDados({
            nome: user.nome ?? '',
            email: user.email ?? '',
            login: user.login ?? '',
            endereco: '',
          });
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [user]);

  function atualizarCampo(
    campo: keyof DadosPerfil,
    valor: string
  ) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarPerfil(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem('');
    setErro(false);
    setSalvando(true);

    try {
      const resposta = await fetch(
        'http://localhost:3333/api/usuarios/me',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(dados),
        }
      );

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

  if (carregando) {
    return (
      <div className="flex flex-1 items-center justify-center bg-stone-50 p-8">
        <p className="text-sm text-stone-500">Carregando seu perfil...</p>
      </div>
    );
  }

  const campos: {
    chave: keyof DadosPerfil;
    rotulo: string;
    tipo: string;
  }[] = [
    { chave: 'nome', rotulo: 'Nome completo', tipo: 'text' },
    { chave: 'email', rotulo: 'E-mail', tipo: 'email' },
    { chave: 'login', rotulo: 'Login', tipo: 'text' },
    { chave: 'endereco', rotulo: 'Endereço', tipo: 'text' },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-amber-50/50 via-stone-50 to-pink-50/30 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-[#FFF0F7] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#D80075]">
            Minha conta
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Meu perfil
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Olá, {dados.nome || user?.nome}. Aqui você pode consultar e
            atualizar seus dados cadastrais.
          </p>
        </div>

        <form
          onSubmit={salvarPerfil}
          className="rounded-2xl border border-pink-100 bg-white/90 p-6 shadow-xl sm:p-8"
        >
          <div className="mb-6 border-b border-stone-100 pb-5">
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Dados pessoais
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Mantenha suas informações sempre atualizadas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {campos.map((campo) => (
              <div
                key={campo.chave}
                className={campo.chave === 'endereco' ? 'sm:col-span-2' : ''}
              >
                <label
                  htmlFor={campo.chave}
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  {campo.rotulo}
                </label>

                <input
                  id={campo.chave}
                  type={campo.tipo}
                  value={dados[campo.chave]}
                  onChange={(evento) =>
                    atualizarCampo(campo.chave, evento.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#D80075] focus:ring-2 focus:ring-pink-100"
                />
              </div>
            ))}
          </div>

          {mensagem && (
            <div
              role="status"
              className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                erro
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {mensagem}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-stone-500">
              Para sua segurança, a senha não é alterada nesta tela.
            </p>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-[#D80075] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B60063] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
