import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { isAuthenticated, requireRole } from '../middlewares/auth.middleware';
import { TipoUsuario } from '@prisma/client';

const authRoutes = Router();

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/logout', AuthController.logout);
authRoutes.get('/me', AuthController.me);


authRoutes.get('/cliente-area', isAuthenticated, requireRole(TipoUsuario.CLIENTE), (req, res) => {
  res.json({ message: 'Bem-vindo à área do cliente!', user: req.session.user });
});

authRoutes.get('/admin-area', isAuthenticated, requireRole(TipoUsuario.ADMIN), (req, res) => {
  res.json({ message: 'Bem-vindo ao painel administrativo!', user: req.session.user });
});

export { authRoutes };