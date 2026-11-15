import { Router } from 'express';
import { TipoUsuario } from '@prisma/client';
import { PedidoController } from '../controllers/PedidoController';
import { isAuthenticated, requireRole } from '../middlewares/auth.middleware';

const pedidoRoutes = Router();

pedidoRoutes.use(isAuthenticated, requireRole(TipoUsuario.CLIENTE));
pedidoRoutes.post('/', PedidoController.finalizar);
pedidoRoutes.get('/me', PedidoController.listarMeus);

export { pedidoRoutes };
