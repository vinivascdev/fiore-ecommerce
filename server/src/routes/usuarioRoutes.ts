import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { isAuthenticated, requireRole } from "../middlewares/auth.middleware";
import { TipoUsuario } from "@prisma/client";

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Cadastro de usuário
usuarioRoutes.post("/usuarios", (req, res) => {
  return usuarioController.inserir(req, res);
});

// Atualização dos dados do cliente autenticado
usuarioRoutes.put(
  "/usuarios/me",
  isAuthenticated,
  requireRole(TipoUsuario.CLIENTE),
  (req, res) => {
    return usuarioController.atualizar(req, res);
  },
);

// Alteração de senha
usuarioRoutes.put(
  "/usuarios/me/senha",
  isAuthenticated,
  requireRole(TipoUsuario.CLIENTE),
  (req, res) => {
    return usuarioController.alterarSenha(req, res);
  },
);

// Deleção da conta
usuarioRoutes.delete(
  "/usuarios/me",
  isAuthenticated,
  requireRole(TipoUsuario.CLIENTE),
  (req, res) => {
    return usuarioController.excluir(req, res);
  },
);

export default usuarioRoutes;
