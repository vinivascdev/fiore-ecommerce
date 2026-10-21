-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CLIENTE', 'ADMIN');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo_usuario" "TipoUsuario" NOT NULL DEFAULT 'CLIENTE',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id_produto" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao_olfativa" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "quantidade_estoque" INTEGER NOT NULL,
    "imagem_url" TEXT NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id_pedido" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "itens_pedido" (
    "id_item_pedido" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id_item_pedido")
);

-- CreateTable
CREATE TABLE "carrinho_itens" (
    "id_carrinho_item" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "carrinho_itens_pkey" PRIMARY KEY ("id_carrinho_item")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_login_key" ON "usuarios"("login");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrinho_itens" ADD CONSTRAINT "carrinho_itens_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
