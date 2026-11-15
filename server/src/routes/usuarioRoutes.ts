import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { isAuthenticated } from '../middlewares/auth.middleware';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.get('/usuarios/me', isAuthenticated, (req, res) =>
  usuarioController.consultarPerfil(req, res)
);

usuarioRoutes.put('/usuarios/me', isAuthenticated, (req, res) =>
  usuarioController.atualizar(req, res)
);

usuarioRoutes.put('/usuarios/me/senha', isAuthenticated, (req, res) =>
  usuarioController.alterarSenha(req, res)
);

usuarioRoutes.delete('/usuarios/me', isAuthenticated, (req, res) =>
  usuarioController.excluir(req, res)
);

export default usuarioRoutes;