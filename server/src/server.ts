import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { authRoutes } from './routes/auth.routes';
import usuarioRoutes from './routes/usuarioRoutes';
import { adminRoutes } from './routes/admin.routes';
import { prisma } from './database/prisma';

const app = express();
const port = process.env.PORT || 3333;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fiore_perfumes_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

// Rota pública para a Home listar os produtos e categorias cadastrados
app.get('/api/produtos', async (_req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { id_produto: 'desc' },
    });
    return res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos da vitrine:', error);
    return res.status(500).json({ message: 'Erro ao carregar produtos.' });
  }
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de usuários
app.use('/api', usuarioRoutes);

// Rotas do Painel Administrativo
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🌸 Servidor Fiore rodando na porta ${port}`);
  });
}

export { app };