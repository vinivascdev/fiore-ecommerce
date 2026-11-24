import React from 'react';
import { Link } from 'react-router-dom';

export const Termos: React.FC = () => {
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
              Termos de Uso
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Última atualização: 23 de novembro de 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar, navegar ou efetuar compras na plataforma <strong>Fiore Perfumes</strong>,
                você concorda expressamente com os presentes Termos de Uso e com nossa Política de
                Privacidade. Caso não concorde com qualquer disposição aqui apresentada, solicitamos
                que não prossiga com a utilização de nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                2. Cadastro e Responsabilidades do Usuário
              </h2>
              <p>
                Para realizar compras em nossa loja, o usuário deve criar uma conta informando dados
                verídicos, completos e atualizados (nome completo, e-mail, telefone e endereço).
                O usuário é o único responsável pela guarda e confidencialidade de sua senha de acesso,
                bem como por todas as atividades realizadas sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                3. Produtos, Catálogo e Disponibilidade
              </h2>
              <p>
                A Fiore Perfumes comercializa fragrâncias exclusivas e perfumes finos. As fotos e
                descrições olfativas exibidas no site buscam reproduzir com a máxima precisão as
                características reais de cada item. Os produtos e preços estão sujeitos à disponibilidade
                de estoque. Nos reservamos o direito de limitar quantidades de compra ou corrigir
                eventuais erros tipográficos de preços.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                4. Preços, Frete e Pagamentos
              </h2>
              <p>
                Os preços são cotados em Reais (BRL). Compras acima de R$ 199,00 (após aplicação de cupons)
                possuem frete gratuito para todo o território nacional atendido. Para compras com valor
                inferior, incidirá uma taxa fixa de entrega calculada e exibida no fechamento do pedido.
                Cupons promocionais obedecem às suas regras específicas de elegibilidade e validade.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                5. Direito de Arrependimento e Devoluções
              </h2>
              <p>
                Conforme o Código de Defesa do Consumidor (Art. 49), o cliente tem até 7 (sete) dias
                corridos após o recebimento do pedido para solicitar a devolução ou arrependimento da
                compra. Para que a devolução seja aceita, o perfume deve estar em sua embalagem original,
                sem indícios de violação do lacre ou uso do produto.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 mb-2">
                6. Propriedade Intelectual e Contato
              </h2>
              <p>
                Todos os textos, logotipos, imagens e elementos visuais da plataforma são de propriedade
                exclusiva da Fiore Perfumes. Para dúvidas, solicitações ou suporte, entre em contato
                conosco através da área de atendimento da nossa loja.
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
