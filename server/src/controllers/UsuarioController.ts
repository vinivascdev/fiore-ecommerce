import { Request, Response } from 'express';
import prisma from '../database/prisma';
import { Usuario } from '../models/Usuario';
import { TipoUsuario } from '../models/TipoUsuario';
import bcrypt from 'bcrypt';

export class UsuarioController {
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
}
