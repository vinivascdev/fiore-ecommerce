import React from 'react';
import { Link } from 'react-router-dom';

export const Privacidade: React.FC = () => {
  return (
    <div className="flex-1 bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/cadastro"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#DD0088] hover:underline mb-6"
        >
          ← Voltar para o cadastro
        </Link>

        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-sm">
          <div className="border-b border-stone-200 pb-6 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DD0088]">
              Fiore Perfumes
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Política de Privacidade
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Última atualização: 23 de novembro de 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                1. Compromisso com a sua Privacidade
              </h2>
              <p>
                A <strong>Fiore Perfumes</strong> valoriza a confiança depositada por seus clientes e
                está comprometida em proteger a privacidade e os dados pessoais de seus usuários, em
                estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                2. Dados Pessoais Coletados
              </h2>
              <p>Coletamos apenas os dados essenciais para prestar nossos serviços:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-stone-600">
                <li><strong>Identificação:</strong> nome completo, e-mail e telefone;</li>
                <li><strong>Entrega:</strong> endereço residencial/comercial para envio dos pedidos;</li>
                <li><strong>Segurança:</strong> credenciais protegidas por função hash criptográfica unidirecional (bcrypt);</li>
                <li><strong>Navegação:</strong> cookies estritamente necessários para gestão de sessão de login e carrinho de compras.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                3. Finalidade do Tratamento de Dados
              </h2>
              <p>Seus dados são utilizados exclusivamente para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-stone-600">
                <li>Processar, faturar e entregar seus pedidos com segurança;</li>
                <li>Permitir acesso seguro à sua conta de cliente e ao histórico de compras;</li>
                <li>Enviar confirmações de pedidos e atualizações do status de entrega;</li>
                <li>Cumprir obrigações legais e fiscais aplicáveis ao comércio eletrônico.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                4. Segurança e Armazenamento
              </h2>
              <p>
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
                acesso não autorizado, destruição, alteração ou perda. Toda a comunicação trafega sobre
                protocolo seguro HTTPS com certificados SSL/TLS atualizados, e as sessões utilizam
                cookies seguros com proteção HttpOnly.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                5. Compartilhamento com Terceiros
              </h2>
              <p>
                A Fiore Perfumes não vende, aluga ou compartilha seus dados pessoais para fins publicitários
                de terceiros. O compartilhamento ocorre estritamente quando indispensável para a conclusão
                do serviço contratado (ex.: transportadoras e serviços logísticos para entrega do pedido).
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                6. Seus Direitos
              </h2>
              <p>
                Você possui total controle sobre seus dados pessoais. A qualquer momento, pela área
                <strong> Minha Conta</strong>, você pode visualizar, corrigir ou atualizar suas informações.
                Você também tem o direito de solicitar a exclusão de sua conta, desde que não existam
                pedidos vinculados que exijam guarda fiscal pelo prazo legal.
              </p>
            </section>
          </div>

          <div className="border-t border-stone-200 mt-8 pt-6 flex justify-between items-center text-xs text-stone-500">
            <span>Fiore Perfumes © {new Date().getFullYear()}</span>
            <Link to="/cadastro" className="text-[#DD0088] font-semibold hover:underline">
              Ir para Cadastro →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
