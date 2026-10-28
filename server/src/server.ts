
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { authRoutes } from './routes/auth.routes';
import usuarioRoutes from './routes/usuarioRoutes';

const app = express();
const port = process.env.PORT || 3333;

// Configuração do CORS para permitir envio de cookies do React
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Configuração do middleware de sessão
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

// Rota de teste
app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de usuários
app.use('/api', usuarioRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🌸 Servidor Fiore rodando na porta ${port}`);
  });
}

export { app };
