import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../database/prisma'; 

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
      }

      const usuario = await prisma.usuario.findFirst({
        where: {
          OR: [
            { login: login },
            { email: login }
          ]
        }
      });

      if (!usuario) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      const senhaValidaTextoPuro = senha === usuario.senha;

      if (!senhaValida && !senhaValidaTextoPuro) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      req.session.user = {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        login: usuario.login,
        tipo_usuario: usuario.tipo_usuario
      };

      return res.json({
        message: 'Login realizado com sucesso!',
        user: req.session.user
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno no servidor ao tentar realizar login.' });
    }
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao encerrar a sessão.' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logout realizado com sucesso.' });
    });
  }

  static async me(req: Request, res: Response) {
    if (req.session && req.session.user) {
      return res.json({ authenticated: true, user: req.session.user });
    }
    return res.json({ authenticated: false, user: null });
  }
}