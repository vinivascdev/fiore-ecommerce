# 🌸 Fiore Perfumes - E-Commerce

Projeto de e-commerce de perfumaria de luxo com arquitetura desacoplada em backend (`/server`) e frontend (`/client`).

---

## 📁 Estrutura do Repositório

```text
fiore-ecommerce/
├── .gitignore               # Configurações de arquivos ignorados pelo Git
├── README.md                # Documentação geral do repositório
├── client/                  # Aplicação Frontend (Vite + React + TS + Tailwind CSS)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
└── server/                  # Aplicação Backend (Node.js + Express + TypeScript + Prisma)
    ├── prisma/
    │   └── schema.prisma    # Mapeamento e schema relacional (PostgreSQL)
    ├── src/
    │   ├── database/        # Conexão e instância do PrismaClient
    │   ├── models/          # Entidades de Domínio (POO, atributos privados, getters/setters)
    │   ├── controllers/     # Controladores das rotas (.gitkeep)
    │   ├── middlewares/     # Middlewares de sessão / autenticação (.gitkeep)
    │   ├── routes/          # Definição das rotas Express (.gitkeep)
    │   └── server.ts        # Ponto de entrada do Express (JSON, CORS e rota /health)
    ├── .env.example         # Exemplo de configuração de variáveis de ambiente
    ├── package.json         # Dependências e scripts (dev, build, start)
    └── tsconfig.json        # Configurações de compilação do TypeScript
```

---

## 🚀 Como Executar o Backend (`/server`)

1. Entre no diretório:
   ```bash
   cd server
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Gere o cliente do Prisma:
   ```bash
   npx prisma generate
   ```

5. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   A API estará ouvindo na porta configurada (padrão: `3333` em `http://localhost:3333`).

6. Verifique o status da API:
   ```bash
   curl http://localhost:3333/health
   # Resposta: {"status":"ok"}
   ```
