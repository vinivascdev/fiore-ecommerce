<<<<<<< HEAD

=======
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { authRoutes } from './routes/auth.routes';
<<<<<<< HEAD
import usuarioRoutes from './routes/usuarioRoutes';
=======
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3

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

<<<<<<< HEAD
// Configuração do middleware de sessão
=======
// Configuração do middleware de Sessão
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fiore_perfumes_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
<<<<<<< HEAD
      maxAge: 1000 * 60 * 60 * 2,
=======
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
    },
  })
);

<<<<<<< HEAD
// Rota de teste
=======
// Rota de teste simples
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

<<<<<<< HEAD
// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de usuários
app.use('/api', usuarioRoutes);

=======
// Registrar rotas de autenticação
app.use('/api/auth', authRoutes);

>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🌸 Servidor Fiore rodando na porta ${port}`);
  });
}

<<<<<<< HEAD
export { app };
=======
export { app };
>>>>>>> 51074f578359a0731a004169b3f7649b633f7cc3
