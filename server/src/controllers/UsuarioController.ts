import { Request, Response } from 'express';
import prisma from '../database/prisma';
import { Usuario } from '../models/Usuario';
import { TipoUsuario } from '../models/TipoUsuario';
import * as bcrypt from 'bcrypt';

export class UsuarioController {
  // Cadastrar um novo usuário
  async inserir(req: Request, res: Response) {
    try {
      const { nome, endereco, email, login, senha } = req.body;

      if (!nome || !endereco || !email || !login || !senha) {
        return res.status(400).json({
          mensagem: 'Preencha todos os campos do cadastro.',
        });
      }

      const emailExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return res.status(409).json({
          mensagem: 'Este e-mail já está cadastrado.',
        });
      }

      const loginExistente = await prisma.usuario.findUnique({
        where: { login },
      });

      if (loginExistente) {
        return res.status(409).json({
          mensagem: 'Este login já está cadastrado.',
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = new Usuario(
        nome,
        email,
        login,
        senhaHash,
        endereco,
        TipoUsuario.CLIENTE
      );

      const usuarioSalvo = await prisma.usuario.create({
        data: usuario.toPersistence(),
      });

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: Usuario.fromPersistence(usuarioSalvo).toJSON(),
      });
    } catch (erro) {
      console.error('Erro ao cadastrar usuário:', erro);

      return res.status(500).json({
        mensagem: 'Erro interno ao processar o cadastro.',
      });
      
    }
  }
  
  // Consultar os dados do cliente autenticado
  async consultarPerfil(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: 'Faça login para continuar.',
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: {
          id_usuario: usuarioSessao.id_usuario,
        },
        select: {
          id_usuario: true,
          nome: true,
          email: true,
          login: true,
          endereco: true,
          tipo_usuario: true,
        },
      });

      if (!usuario) {
        return res.status(404).json({
          mensagem: 'Usuário não encontrado.',
        });
      }

      return res.status(200).json({
        usuario,
      });
    } catch (erro) {
      console.error('Erro ao consultar perfil:', erro);

      return res.status(500).json({
        mensagem: 'Erro interno ao consultar o perfil.',
      });
    }
  }


  // Atualizar os dados do cliente autenticado
  async atualizar(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: 'Faça login para continuar.',
        });
      }

      const { nome, endereco, email, login } = req.body;

      // Validar os campos obrigatórios
      if (
        typeof nome !== 'string' ||
        !nome.trim() ||
        typeof endereco !== 'string' ||
        !endereco.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof login !== 'string' ||
        !login.trim()
      ) {
        return res.status(400).json({
          mensagem: 'Preencha todos os campos obrigatórios.',
        });
      }

      const dados = {
        nome: nome.trim(),
        endereco: endereco.trim(),
        email: email.trim(),
        login: login.trim(),
      };

      // Verificar se o e-mail pertence a outro usuário
      const emailExistente = await prisma.usuario.findFirst({
        where: {
          email: dados.email,
          NOT: {
            id_usuario: usuarioSessao.id_usuario,
          },
        },
      });

      if (emailExistente) {
        return res.status(409).json({
          mensagem: 'Este e-mail já está cadastrado.',
        });
      }

      // Verificar se o login pertence a outro usuário
      const loginExistente = await prisma.usuario.findFirst({
        where: {
          login: dados.login,
          NOT: {
            id_usuario: usuarioSessao.id_usuario,
          },
        },
      });

      if (loginExistente) {
        return res.status(409).json({
          mensagem: 'Este login já está cadastrado.',
        });
      }

      // Atualizar somente o usuário da sessão
      const usuarioAtualizado = await prisma.usuario.update({
        where: {
          id_usuario: usuarioSessao.id_usuario,
        },
        data: dados,
        select: {
          id_usuario: true,
          nome: true,
          endereco: true,
          email: true,
          login: true,
          tipo_usuario: true,
        },
      });

      // Atualizar os dados do usuário na sessão
      req.session.user = {
        ...req.session.user,
        ...usuarioAtualizado,
      };

      return res.status(200).json({
        mensagem: 'Dados atualizados com sucesso!',
        usuario: usuarioAtualizado,
      });
    } catch (erro) {
      console.error('Erro ao atualizar usuário:', erro);

      return res.status(500).json({
        mensagem: 'Erro interno ao atualizar os dados.',
      });
    }
  }
}