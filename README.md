# 🌸 Fiore Perfumes - E-Commerce de Luxo

Projeto full-stack de e-commerce de perfumaria de luxo desenvolvido em **TypeScript**, **React**, **Tailwind CSS**, **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL** (com suporte total ao banco online no **Supabase**).

---

## 📁 Estrutura do Repositório

```text
fiore-ecommerce/
├── EQUIPE.txt               # Identificação dos integrantes para entrega acadêmica (TF03)
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

## 📋 Funcionalidades da 3ª Entrega (TF03)

1. **Página Inicial Pública (Home - `/`):**
   * Acesso 100% público sem necessidade de autenticação.
   * Busca dinâmica de produtos via rota `GET /api/produtos`.
   * Filtro automático exibindo apenas produtos com **estoque disponível** (`quantidade_estoque > 0`).
   * Destaque na foto, descrição olfativa detalhada, preço em Real (BRL) e status de estoque.
   * Links diretos e visíveis para Entrar (Login único), Cadastre-se e Carrinho de Compras.

2. **Segurança, Autenticação e Sessão:**
   * Sessão persistente baseada em cookies seguros com `express-session` (`connect.sid`).
   * Validação rigorosa no front-end em `Register.tsx` (nome, sobrenome, formato válido de e-mail, telefone com DDD, endereço, senha mínima de 6 caracteres e termos de uso).
   * Middleware de autenticação no backend (`isAuthenticated`) e validação de role (`requireRole(TipoUsuario.ADMIN)`).
   * Proteção de rotas no frontend (`ProtectedRoute` e `GuestRoute`).
   * Cliente logado altera dados pessoais e exclui o próprio cadastro em `/minha-conta`.
   * Administrador logado altera dados pessoais e exclui o próprio cadastro em `/admin/perfil`.

3. **Painel do Administrador (`/admin/*`):**
   * **CRUD de Categorias:** Listagem com contagem de produtos, criação, edição e exclusão (com bloqueio seguro e aviso amigável caso haja produtos vinculados).
   * **CRUD de Produtos:** Listagem com busca e filtro por categoria, criação, edição de todos os atributos e atualização de **quantidade em estoque**.
   * **Upload de Fotos para o Servidor:** Inclusão, substituição e remoção de fotos de produtos através de upload de arquivo via `multer` com armazenamento em `server/uploads` e serviço estático pelo Express, com prévia em tempo real e fallback.
