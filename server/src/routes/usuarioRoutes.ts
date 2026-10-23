
import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.post('/usuarios', (req, res) => {
  return usuarioController.inserir(req, res);
});

export default usuarioRoutes;
