# 🌸 Fiore Perfumes - E-Commerce de Luxo

Projeto full-stack de e-commerce de perfumaria de luxo desenvolvido em **TypeScript**, **React**, **Tailwind CSS**, **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL** (com suporte total ao banco online no **Supabase**).

---

## 📁 Estrutura do Repositório

```text
fiore-ecommerce/
├── EQUIPE.txt               # Identificação dos integrantes para entrega acadêmica (TF04)
├── README.md                # Documentação técnica e instruções de execução
├── client/                  # Frontend (React + Vite + Tailwind CSS + Context API)
│   ├── src/
│   │   ├── components/      # Header, rotas protegidas (ProtectedRoute, GuestRoute)
│   │   ├── context/         # AuthContext (sessão de cliente/admin) e CarrinhoContext
│   │   ├── pages/           # Home pública, Login, Cadastro, Recuperar Senha, Perfil
│   │   │   └── admin/       # Dashboard, CRUD Categorias, CRUD Produtos, Pedidos, Usuários, Relatórios
│   │   └── utils/           # Formatador de URLs de imagens estáticas e dinâmicas
│   └── package.json
└── server/                  # Backend API (Node.js + Express + TypeScript + Prisma ORM)
    ├── prisma/
    │   ├── migrations/      # Histórico de migrações relacionais
    │   ├── schema.prisma    # Mapeamento do banco com suporte a directUrl (Supabase)
    │   └── seed.ts          # Script de seed para categorias e administrador inicial
    ├── uploads/             # Diretório de arquivos de fotos de produtos (Multer)
    ├── src/
    │   ├── controllers/     # Controladores das regras de negócio (Admin, Auth, Usuario, Pedido)
    │   ├── database/        # Conexão singleton PrismaClient
    │   ├── middlewares/     # Validação de sessão, verificação de role e upload Multer
    │   └── routes/          # Rotas REST autenticadas e públicas
    ├── .env.example         # Template de variáveis de ambiente (Local e Supabase)
    └── package.json
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Backend (`/server`)

1. Entre na pasta do servidor:
   ```bash
   cd server
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   *(Ajuste o `DATABASE_URL` e `DIRECT_URL` para o seu PostgreSQL local ou as credenciais do Supabase)*.

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Aplique as migrações e gere o Prisma Client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Execute o seed para criar o administrador padrão e categorias iniciais:
   ```bash
   npm run seed
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   * A API responderá em: `http://localhost:3333`
   * Teste de integridade: `http://localhost:3333/health`

---

### 2. Frontend (`/client`)

1. Em outro terminal, entre na pasta do cliente:
   ```bash
   cd client
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```
   * O aplicativo estará disponível em: **`http://localhost:5173`**

---

## 🌐 Configuração do Banco de Dados Online no Supabase

O projeto está configurado para o PostgreSQL hospedado no **Supabase**, utilizando conexão com Pooling (PgBouncer) para a aplicação e Conexão Direta para as migrações do Prisma ORM.

### Configuração no `server/.env`:

Obtenha as strings de conexão no painel do Supabase em **Project Settings > Database**:

```env
# 1. Modo Transaction / Session Pooling (porta 6543) com pgbouncer=true
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-[REGIAO].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Conexão Direta (porta 5432) para migrations do Prisma
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-[REGIAO].pooler.supabase.com:5432/postgres"

PORT=3333
SESSION_SECRET="chave_secreta_super_segura_fiore"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

### Aplicando as Migrações no Supabase:
No terminal da pasta `server/`, execute:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Criando ou Promovendo um Usuário a Administrador Manualmente:
Se preferir cadastrar um usuário pela tela de cadastro e promovê-lo a administrador via SQL direto no **SQL Editor** do Supabase, execute:
```sql
UPDATE usuarios 
SET tipo_usuario = 'ADMIN' 
WHERE email = 'seu_email@exemplo.com';
```

---

## 🔑 Credenciais Padrão do Administrador (via Seed)
* **E-mail:** `admin@fiore.com`
* **Senha:** `admin123`
* **Área de Acesso:** `/login` (redireciona automaticamente para o painel `/admin`)

---

## 📋 Funcionalidades da Entrega Completa (TF04)

1. **Página Inicial Pública & Busca Integrada (Home - `/`):**
   * Acesso 100% público sem necessidade de autenticação.
   * Barra de busca no Header conectada à vitrine via URL (`/?busca=...`), filtrando produtos por nome, descrição olfativa e categoria com opção de limpar filtro.
   * Filtro automático exibindo apenas produtos com **estoque disponível** (`quantidade_estoque > 0`).
   * Destaque na foto, descrição olfativa detalhada, preço em Real (BRL) e status de estoque.

2. **Segurança, Autenticação e Sessão:**
   * Sessão persistente baseada em cookies seguros com `express-session` (`connect.sid`).
   * Validação rigorosa no front-end em `Register.tsx` (nome, sobrenome, formato válido de e-mail, telefone com DDD, endereço, senha mínima de 6 caracteres e termos de uso).
   * Middleware de autenticação no backend (`isAuthenticated`) e validação de role (`requireRole(TipoUsuario.ADMIN)`).
   * Proteção de rotas no frontend (`ProtectedRoute` e `GuestRoute`).
   * Cliente logado altera dados pessoais e exclui o próprio cadastro em `/minha-conta`.
   * Administrador logado altera dados pessoais e exclui o próprio cadastro em `/admin/perfil`.

3. **Carrinho de Compras, Cupons e Frete:**
   * Adição dinâmica de itens com checagem de estoque.
   * Aplicação e validação de cupons de desconto (`FIORE10`: 10%, `BEMVINDO15`: 15%).
   * Cálculo de frete por CEP (R$ 24,90 ou Frete Grátis em compras acima de R$ 199,00).
   * Sincronização estrita de valores: o backend valida cupons e frete, garantindo que o valor salvo no pedido seja idêntico ao do carrinho.

4. **Pedidos e Baixa Atômica de Estoque:**
   * Finalização de compra transacional via `prisma.$transaction`: validação de estoque em tempo real, decremento imediato e gravação do pedido.
   * Histórico de pedidos do cliente em `/minha-conta` com status, itens e valor total.

5. **Painel do Administrador & Relatórios Gerenciais (`/admin/*`):**
   * **Dashboard:** Resumo de receita, clientes cadastrados, categorias e produtos com estoque zerado.
   * **CRUD de Categorias:** Listagem com contagem de produtos, criação, edição e exclusão segura.
   * **CRUD de Produtos:** Listagem com busca/filtro, criação, edição de estoque e upload/troca/remoção de foto (Multer com armazenamento local estático).
   * **Gestão de Pedidos:** Listagem, alteração de status (ex: "Enviado"), exclusão e impressão de detalhes do pedido (com layout de impressão limpo).
   * **Relatórios Gerenciais:**
     - Compras por cliente (com ID real do cliente).
     - Receita por dia (gráfico de barras e valores).
     - Produtos em falta (com ID real do produto, categoria e estoque zerado).
     - Exportação em arquivo `.txt` formatado e em formato **HTML** para impressão/PDF limpa (com ocultação automática de controles e sidebar via `print:hidden`).
