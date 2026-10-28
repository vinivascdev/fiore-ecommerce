<<<<<<< HEAD
import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { isAuthenticated, requireRole } from "../middlewares/auth.middleware";
import { TipoUsuario } from "@prisma/client";
=======

import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

<<<<<<< HEAD
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

=======
usuarioRoutes.post('/usuarios', (req, res) => {
  return usuarioController.inserir(req, res);
});

>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
export default usuarioRoutes;
