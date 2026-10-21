import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(usuarioRoutes);

app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🌸 Servidor Fiore rodando na porta ${port}`);
  });
}

export { app };
