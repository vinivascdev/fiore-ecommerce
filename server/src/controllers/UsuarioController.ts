import { Request, Response } from "express";
import { TipoUsuario } from "@prisma/client";
import prisma from "../database/prisma";
import * as bcrypt from "bcryptjs";

export class UsuarioController {
  // Cadastrar um novo usuário
  async inserir(req: Request, res: Response) {
    try {
      const { nome, endereco, email, telefone, senha } = req.body;

      if (!nome || !endereco || !email || !senha) {
        return res.status(400).json({
          mensagem: "Preencha todos os campos obrigatórios do cadastro.",
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const emailExistente = await prisma.usuario.findUnique({
        where: { email: emailNormalizado },
      });

      if (emailExistente) {
        return res.status(409).json({
          mensagem: "Este e-mail já está cadastrado.",
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuarioSalvo = await prisma.usuario.create({
        data: {
          nome: nome.trim(),
          email: emailNormalizado,
          telefone: telefone?.trim() || null,
          senha: senhaHash,
          endereco: endereco.trim(),
          tipo_usuario: TipoUsuario.CLIENTE,
        },
        select: {
          id_usuario: true,
          nome: true,
          email: true,
          telefone: true,
          endereco: true,
          tipo_usuario: true,
        },
      });

      return res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: usuarioSalvo,
      });
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);

      return res.status(500).json({
        mensagem: "Erro interno ao processar o cadastro.",
      });
    }
  }

  // Consultar os dados do cliente autenticado
  async consultarPerfil(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: "Faça login para continuar.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: usuarioSessao.id_usuario },
        select: {
          id_usuario: true,
          nome: true,
          email: true,
          telefone: true,
          endereco: true,
          tipo_usuario: true,
        },
      });

      if (!usuario) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        usuario,
      });
    } catch (erro) {
      console.error("Erro ao consultar perfil:", erro);

      return res.status(500).json({
        mensagem: "Erro interno ao consultar o perfil.",
      });
    }
  }

  // Atualizar os dados do cliente autenticado
  async atualizar(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: "Faça login para continuar.",
        });
      }

      const { nome, sobrenome, nomeCompleto, endereco, email, telefone } = req.body;

      // Monta o nome completo caso o frontend envie nome e sobrenome separados
      const nomeFinal =
        typeof nomeCompleto === "string" && nomeCompleto.trim()
          ? nomeCompleto.trim()
          : `${nome ?? ""} ${sobrenome ?? ""}`.trim();

      if (
        !nomeFinal ||
        typeof endereco !== "string" ||
        !endereco.trim() ||
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res.status(400).json({
          mensagem: "Preencha todos os campos obrigatórios (nome, e-mail e endereço).",
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      // Verificar se o e-mail pertence a outro usuário
      const emailExistente = await prisma.usuario.findFirst({
        where: {
          email: emailNormalizado,
          NOT: {
            id_usuario: usuarioSessao.id_usuario,
          },
        },
      });

      if (emailExistente) {
        return res.status(409).json({
          mensagem: "Este e-mail já está cadastrado em outra conta.",
        });
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: {
          id_usuario: usuarioSessao.id_usuario,
        },
        data: {
          nome: nomeFinal,
          email: emailNormalizado,
          telefone: typeof telefone === "string" && telefone.trim() ? telefone.trim() : null,
          endereco: endereco.trim(),
        },
        select: {
          id_usuario: true,
          nome: true,
          email: true,
          telefone: true,
          endereco: true,
          tipo_usuario: true,
        },
      });

      // Atualiza os dados da sessão
      req.session.user = {
        id_usuario: usuarioAtualizado.id_usuario,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo_usuario: usuarioAtualizado.tipo_usuario,
      };

      return res.status(200).json({
        mensagem: "Dados atualizados com sucesso!",
        usuario: usuarioAtualizado,
      });
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);

      return res.status(500).json({
        mensagem: "Erro interno ao atualizar os dados.",
      });
    }
  }

  // Alterar a senha do cliente autenticado
  async alterarSenha(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: "Faça login para continuar.",
        });
      }

      const { senhaAtual, novaSenha } = req.body;

      if (
        typeof senhaAtual !== "string" ||
        !senhaAtual ||
        typeof novaSenha !== "string" ||
        novaSenha.length < 6
      ) {
        return res.status(400).json({
          mensagem:
            "Informe a senha atual e uma nova senha com pelo menos 6 caracteres.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: usuarioSessao.id_usuario },
      });

      if (!usuario) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado.",
        });
      }

      const senhaValida =
        (await bcrypt.compare(senhaAtual, usuario.senha)) ||
        senhaAtual === usuario.senha;

      if (!senhaValida) {
        return res.status(400).json({
          mensagem: "A senha atual está incorreta.",
        });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      await prisma.usuario.update({
        where: { id_usuario: usuarioSessao.id_usuario },
        data: { senha: novaSenhaHash },
      });

      return res.status(200).json({
        mensagem: "Senha alterada com sucesso!",
      });
    } catch (erro) {
      console.error("Erro ao alterar senha:", erro);

      return res.status(500).json({
        mensagem: "Erro interno ao alterar a senha.",
      });
    }
  }

  // Excluir a conta do cliente autenticado
  async excluir(req: Request, res: Response) {
    try {
      const usuarioSessao = req.session.user;

      if (!usuarioSessao) {
        return res.status(401).json({
          mensagem: "Faça login para continuar.",
        });
      }

      const pedidosVinculados = await prisma.pedido.count({
        where: { id_cliente: usuarioSessao.id_usuario },
      });

      if (pedidosVinculados > 0) {
        return res.status(400).json({
          mensagem: "Não é possível excluir a conta pois existem pedidos vinculados ao seu cadastro.",
        });
      }

      await prisma.usuario.delete({
        where: { id_usuario: usuarioSessao.id_usuario },
      });

      req.session.destroy((err) => {
        if (err) {
          console.error("Erro ao encerrar a sessão:", err);
          return res.status(500).json({
            mensagem: "Conta excluída, mas houve erro ao encerrar a sessão.",
          });
        }

        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie("connect.sid", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
        });
        return res.status(200).json({
          mensagem: "Conta excluída com sucesso.",
        });
      });
    } catch (erro) {
      console.error("Erro ao excluir usuário:", erro);

      return res.status(500).json({
        mensagem:
          "Não foi possível excluir a conta. Tente novamente mais tarde.",
      });
    }
  }
}