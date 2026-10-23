import { Request, Response, NextFunction } from 'express';
import { TipoUsuario } from '@prisma/client';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Sessão não encontrada ou expirada. Faça login para continuar.' });
}

export function requireRole(tipo: TipoUsuario) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Sessão não encontrada.' });
    }

    if (req.session.user.tipo_usuario !== tipo) {
      return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  };
}