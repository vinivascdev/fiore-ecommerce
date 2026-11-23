import { Request, Response } from 'express';
import path from 'path';
import { prisma } from '../database/prisma';
import { supabase, SUPABASE_BUCKET } from '../database/supabase';

export class AdminController {
  // ==================== DASHBOARD ====================
  static async getDashboard(_req: Request, res: Response) {
    try {
      const [pedidos, totalClientes, totalCategorias, produtosSemEstoque, pedidosRecentes] =
        await Promise.all([
          prisma.pedido.findMany({ select: { valor_total: true } }),
          prisma.usuario.count({ where: { tipo_usuario: 'CLIENTE' } }),
          prisma.categoria.count(),
          prisma.produto.findMany({
            where: { quantidade_estoque: 0 },
            include: { categoria: true },
          }),
          prisma.pedido.findMany({
            take: 5,
            orderBy: { data_pedido: 'desc' },
            include: { cliente: { select: { nome: true } } },
          }),
        ]);

      const receitaTotal = pedidos.reduce((acc, p) => acc + Number(p.valor_total), 0);

      return res.json({
        receitaTotal,
        totalClientes,
        totalCategorias,
        semEstoqueCount: produtosSemEstoque.length,
        produtosSemEstoque,
        pedidosRecentes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao carregar dados do dashboard.' });
    }
  }

  // ==================== UPLOAD E GESTÃO DE FOTOS (SUPABASE STORAGE) ====================
  private static async removerFotoSupabase(imagemUrl?: string | null) {
    if (!imagemUrl || typeof imagemUrl !== 'string') return;
    try {
      // Padrão de URL pública do Supabase Storage:
      // .../storage/v1/object/public/[BUCKET]/[CAMINHO_DO_ARQUIVO]
      const marcador = `/storage/v1/object/public/${SUPABASE_BUCKET}/`;
      const index = imagemUrl.indexOf(marcador);
      if (index !== -1) {
        const caminhoRelativo = decodeURIComponent(imagemUrl.substring(index + marcador.length));
        if (caminhoRelativo) {
          await supabase.storage.from(SUPABASE_BUCKET).remove([caminhoRelativo]);
        }
      }
    } catch (err) {
      // Captura silenciosa para garantir que erros de limpeza não interrompam o fluxo principal
      console.warn('Aviso: Falha ao remover imagem do Supabase Storage:', err);
    }
  }

  static async uploadFoto(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const baseName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `produtos/${baseName || 'foto'}-${uniqueSuffix}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error('Erro no upload para o Supabase Storage:', uploadError);
        return res.status(500).json({
          message: `Erro ao enviar foto para o Supabase Storage: ${uploadError.message}`,
        });
      }

      const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fileName);

      return res.status(200).json({
        message: 'Foto enviada com sucesso!',
        url: data.publicUrl,
        filename: fileName,
      });
    } catch (error: any) {
      console.error('Erro no upload de foto:', error);
      return res.status(500).json({
        message: error?.message || 'Erro ao processar upload da foto.',
      });
    }
  }

  // ==================== CATEGORIAS (CRUD) ====================
  static async listarCategorias(_req: Request, res: Response) {
    const categorias = await prisma.categoria.findMany({
      include: { _count: { select: { produtos: true } } },
      orderBy: { id_categoria: 'asc' },
    });
    return res.json(categorias);
  }

  static async criarCategoria(req: Request, res: Response) {
    const { nome } = req.body;
    if (!nome?.trim()) return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });

    const categoria = await prisma.categoria.create({ data: { nome: nome.trim() } });
    return res.status(201).json(categoria);
  }

  static async atualizarCategoria(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome } = req.body;
    if (!nome?.trim()) return res.status(400).json({ message: 'Nome da categoria é obrigatório.' });

    const categoria = await prisma.categoria.update({
      where: { id_categoria: id },
      data: { nome: nome.trim() },
    });
    return res.json(categoria);
  }

  static async excluirCategoria(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.categoria.delete({ where: { id_categoria: id } });
      return res.json({ message: 'Categoria excluída com sucesso.' });
    } catch {
      return res.status(400).json({
        message: 'Não é possível excluir categoria que possui produtos vinculados.',
      });
    }
  }

  // ==================== PRODUTOS (CRUD) ====================
  static async listarProdutos(_req: Request, res: Response) {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { id_produto: 'asc' },
    });
    return res.json(produtos);
  }

  static async criarProduto(req: Request, res: Response) {
    try {
      const { nome, descricao_olfativa, preco, quantidade_estoque, imagem_url, id_categoria } =
        req.body;

      if (!nome || !preco || !id_categoria) {
        return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios.' });
      }

      const produto = await prisma.produto.create({
        data: {
          nome: nome.trim(),
          descricao_olfativa: descricao_olfativa?.trim() || '',
          preco: Number(preco),
          quantidade_estoque: Number(quantidade_estoque) || 0,
          imagem_url: imagem_url?.trim() || '',
          id_categoria: Number(id_categoria),
        },
        include: { categoria: true },
      });

      return res.status(201).json(produto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao cadastrar produto.' });
    }
  }

  static async atualizarProduto(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nome, descricao_olfativa, preco, quantidade_estoque, imagem_url, id_categoria } =
        req.body;

      const produtoAtual = await prisma.produto.findUnique({
        where: { id_produto: id },
        select: { imagem_url: true },
      });

      const produto = await prisma.produto.update({
        where: { id_produto: id },
        data: {
          nome: nome.trim(),
          descricao_olfativa: descricao_olfativa?.trim() || '',
          preco: Number(preco),
          quantidade_estoque: Number(quantidade_estoque) || 0,
          imagem_url: imagem_url?.trim() || '',
          id_categoria: Number(id_categoria),
        },
        include: { categoria: true },
      });

      // Se a foto foi alterada ou removida, remove a foto antiga do Supabase Storage
      if (produtoAtual?.imagem_url && produtoAtual.imagem_url !== produto.imagem_url) {
        await AdminController.removerFotoSupabase(produtoAtual.imagem_url);
      }

      return res.json(produto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
  }

  static async excluirProduto(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const produto = await prisma.produto.findUnique({
        where: { id_produto: id },
        select: { imagem_url: true },
      });

      await prisma.produto.delete({ where: { id_produto: id } });

      if (produto?.imagem_url) {
        await AdminController.removerFotoSupabase(produto.imagem_url);
      }

      return res.json({ message: 'Produto removido com sucesso.' });
    } catch {
      return res.status(400).json({
        message: 'Não é possível excluir um produto vinculado a pedidos existentes.',
      });
    }
  }

  // ==================== PEDIDOS (VISUALIZAÇÃO, STATUS E EXCLUSÃO) ====================
  static async listarPedidos(_req: Request, res: Response) {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: { select: { id_usuario: true, nome: true, email: true, telefone: true, endereco: true } },
        itens: { include: { produto: { include: { categoria: true } } } },
      },
      orderBy: { data_pedido: 'desc' },
    });
    return res.json(pedidos);
  }

  static async obterPedido(req: Request, res: Response) {
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: id },
      include: {
        cliente: {
          include: { _count: { select: { pedidos: true } } },
        },
        itens: { include: { produto: { include: { categoria: true } } } },
      },
    });
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado.' });
    return res.json(pedido);
  }

  static async atualizarStatusPedido(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;
    const pedido = await prisma.pedido.update({
      where: { id_pedido: id },
      data: { status },
    });
    return res.json(pedido);
  }

  static async excluirPedido(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.itemPedido.deleteMany({ where: { id_pedido: id } });
      await prisma.pedido.delete({ where: { id_pedido: id } });
      return res.json({ message: 'Pedido excluído com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao excluir pedido.' });
    }
  }

  // ==================== USUÁRIOS ====================
  static async listarUsuarios(_req: Request, res: Response) {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        tipo_usuario: true,
      },
      orderBy: { id_usuario: 'asc' },
    });
    return res.json(usuarios);
  }

  static async excluirUsuario(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.usuario.delete({ where: { id_usuario: id } });
      return res.json({ message: 'Usuário removido com sucesso.' });
    } catch {
      return res.status(400).json({
        message: 'Não é possível excluir usuário que possui pedidos cadastrados.',
      });
    }
  }

  static async alterarRoleUsuario(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { tipo_usuario } = req.body;

      if (tipo_usuario !== 'CLIENTE' && tipo_usuario !== 'ADMIN') {
        return res.status(400).json({ message: 'Tipo de usuário inválido.' });
      }

      // Evita que o próprio admin remova seu acesso acidentalmente
      if (req.session.user?.id_usuario === id && tipo_usuario === 'CLIENTE') {
        return res.status(400).json({
          message: 'Você não pode alterar seu próprio perfil para Cliente enquanto estiver logado.',
        });
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id_usuario: id },
        data: { tipo_usuario },
        select: {
          id_usuario: true,
          nome: true,
          email: true,
          tipo_usuario: true,
        },
      });

      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao alterar papel do usuário:', error);
      return res.status(500).json({ message: 'Erro ao atualizar permissão do usuário.' });
    }
  }

  // ==================== RELATÓRIOS GERENCIAIS ====================
  static async relatorios(req: Request, res: Response) {
    try {
      const { tipo, dataInicio, dataFim } = req.query;

      const filtroData: any = {};
      if (dataInicio) filtroData.gte = new Date(`${dataInicio}T00:00:00.000Z`);
      if (dataFim) filtroData.lte = new Date(`${dataFim}T23:59:59.999Z`);
      const wherePedido = Object.keys(filtroData).length ? { data_pedido: filtroData } : {};

      if (tipo === 'compras-por-cliente') {
        const pedidos = await prisma.pedido.findMany({
          where: wherePedido,
          include: { cliente: { select: { id_usuario: true, nome: true } } },
        });

        const mapa = new Map<number, { id: number; nome: string; totalPedidos: number; valorTotal: number }>();
        for (const p of pedidos) {
          const atual = mapa.get(p.id_cliente) || {
            id: p.id_cliente,
            nome: p.cliente.nome,
            totalPedidos: 0,
            valorTotal: 0,
          };
          atual.totalPedidos += 1;
          atual.valorTotal += Number(p.valor_total);
          mapa.set(p.id_cliente, atual);
        }

        const resultado = Array.from(mapa.values()).sort((a, b) => b.totalPedidos - a.totalPedidos);
        return res.json(resultado);
      }

      if (tipo === 'receita-por-dia') {
        const pedidos = await prisma.pedido.findMany({
          where: wherePedido,
          orderBy: { data_pedido: 'asc' },
        });

        const mapa = new Map<string, number>();
        for (const p of pedidos) {
          const dia = p.data_pedido.toISOString().split('T')[0];
          mapa.set(dia, (mapa.get(dia) || 0) + Number(p.valor_total));
        }

        const resultado = Array.from(mapa.entries()).map(([data, total]) => ({ data, total }));
        return res.json(resultado);
      }

      // Default: produtos-em-falta
      const esgotados = await prisma.produto.findMany({
        where: { quantidade_estoque: 0 },
        include: { categoria: true },
        orderBy: { descricao_olfativa: 'asc' },
      });

      return res.json(esgotados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao gerar relatório.' });
    }
  }
}