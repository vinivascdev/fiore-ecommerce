import 'express-session';
import { TipoUsuario } from '@prisma/client';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id_usuario: number;
      nome: string;
      email: string;
      tipo_usuario: TipoUsuario;
    };
  }
}