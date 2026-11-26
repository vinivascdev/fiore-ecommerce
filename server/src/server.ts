import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import fs from 'fs';
import { authRoutes } from './routes/auth.routes';
import usuarioRoutes from './routes/usuarioRoutes';
import { adminRoutes } from './routes/admin.routes';
import { pedidoRoutes } from './routes/pedido.routes';
import { prisma } from './database/prisma';

const app = express();
const port = process.env.PORT || 3333;

const uploadsPath = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

app.set('trust proxy', 1);

const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

const PgSession = connectPgSimple(session);
const sessionStore = process.env.DATABASE_URL
  ? new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    })
  : undefined;

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'fiore_perfumes_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

// Rota pública para a Home listar os produtos e categorias cadastrados (apenas com estoque disponível)
app.get('/api/produtos', async (_req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        quantidade_estoque: {
          gt: 0,
        },
      },
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
app.use('/api/pedidos', pedidoRoutes);

// Rotas do Painel Administrativo
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🌸 Servidor Fiore rodando na porta ${port}`);
  });
}

export { app };
