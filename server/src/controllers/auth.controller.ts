import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { TipoUsuario } from '@prisma/client';
import { prisma } from '../database/prisma';

export class AuthController {
 static async register(req: Request, res: Response) {
    try {
      const { nome, email, telefone, senha, endereco } = req.body;

      if (!nome || !email || !senha || !endereco) {
        return res.status(400).json({
          message: 'Todos os campos obrigatórios (nome, e-mail, senha e endereço) devem ser preenchidos.',
        });
      }

      if (senha.length < 6) {
        return res.status(400).json({
          message: 'A senha deve ter pelo menos 6 caracteres.',
        });
      }

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (usuarioExistente) {
        return res.status(400).json({
          message: 'Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.',
        });
      }

      const senhaHashada = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone ? telefone.trim() : null, 
          senha: senhaHashada,
          endereco: endereco.trim(),
          tipo_usuario: TipoUsuario.CLIENTE,
        },
      });

      return res.status(201).json({
        message: 'Cliente cadastrado com sucesso!',
        user: {
          id_usuario: novoUsuario.id_usuario,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          telefone: novoUsuario.telefone,
          endereco: novoUsuario.endereco,
          tipo_usuario: novoUsuario.tipo_usuario,
        },
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return res.status(500).json({
        message: 'Erro interno no servidor ao cadastrar cliente.',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const email = req.body.email || req.body.login;
      const { senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Informe seu e-mail e sua senha.' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!usuario) {
        return res.status(401).json({ message: 'E-mail não encontrado ou senha incorreta.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      const senhaValidaTextoPuro = senha === usuario.senha;

      if (!senhaValida && !senhaValidaTextoPuro) {
        return res.status(401).json({ message: 'E-mail não encontrado ou senha incorreta.' });
      }

      req.session.user = {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      };

      return res.json({
        message: 'Login realizado com sucesso!',
        user: req.session.user,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({
        message: 'Erro interno no servidor ao tentar realizar login.',
      });
    }
  }

  // Passo 1 da recuperação: verifica se o e-mail existe na base
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Informe o e-mail cadastrado.' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!usuario) {
        return res.status(404).json({ message: 'Nenhuma conta encontrada com este e-mail.' });
      }

      return res.json({
        message: 'E-mail verificado! Agora você pode definir uma nova senha.',
      });
    } catch (error) {
      console.error('Erro ao verificar e-mail:', error);
      return res.status(500).json({ message: 'Erro interno ao processar solicitação.' });
    }
  }

  // Passo 2 da recuperação: atualiza a senha com hash no banco
  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, novaSenha } = req.body;

      if (!email || !novaSenha) {
        return res.status(400).json({ message: 'E-mail e nova senha são obrigatórios.' });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const senhaHashada = await bcrypt.hash(novaSenha, 10);

      await prisma.usuario.update({
        where: { id_usuario: usuario.id_usuario },
        data: { senha: senhaHashada },
      });

      return res.json({ message: 'Senha redefinida com sucesso! Faça login com a nova senha.' });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return res.status(500).json({ message: 'Erro interno ao redefinir a senha.' });
    }
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao encerrar a sessão.' });
      }
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
      });
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