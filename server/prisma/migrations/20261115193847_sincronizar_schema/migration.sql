/*
  Warnings:

  - You are about to drop the column `login` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "usuarios_login_key";

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Não Enviado';

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "login",
ADD COLUMN     "telefone" TEXT;
