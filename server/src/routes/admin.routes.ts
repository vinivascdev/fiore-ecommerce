import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { isAuthenticated, requireRole } from '../middlewares/auth.middleware';
import { TipoUsuario } from '@prisma/client';

const adminRoutes = Router();

// Todas as rotas protegidas para ADMIN
adminRoutes.use(isAuthenticated, requireRole(TipoUsuario.ADMIN));

adminRoutes.get('/dashboard', AdminController.getDashboard);

adminRoutes.get('/usuarios', AdminController.listarUsuarios);
adminRoutes.patch('/usuarios/:id/role', AdminController.alterarRoleUsuario);
adminRoutes.delete('/usuarios/:id', AdminController.excluirUsuario);

// Categorias
adminRoutes.get('/categorias', AdminController.listarCategorias);
adminRoutes.post('/categorias', AdminController.criarCategoria);
adminRoutes.put('/categorias/:id', AdminController.atualizarCategoria);
adminRoutes.delete('/categorias/:id', AdminController.excluirCategoria);

// Produtos
adminRoutes.get('/produtos', AdminController.listarProdutos);
adminRoutes.post('/produtos', AdminController.criarProduto);
adminRoutes.put('/produtos/:id', AdminController.atualizarProduto);
adminRoutes.delete('/produtos/:id', AdminController.excluirProduto);

// Pedidos
adminRoutes.get('/pedidos', AdminController.listarPedidos);
adminRoutes.get('/pedidos/:id', AdminController.obterPedido);
adminRoutes.patch('/pedidos/:id/status', AdminController.atualizarStatusPedido);
adminRoutes.delete('/pedidos/:id', AdminController.excluirPedido);

// Usuários
adminRoutes.get('/usuarios', AdminController.listarUsuarios);
adminRoutes.delete('/usuarios/:id', AdminController.excluirUsuario);

// Relatórios
adminRoutes.get('/relatorios', AdminController.relatorios);

export { adminRoutes };