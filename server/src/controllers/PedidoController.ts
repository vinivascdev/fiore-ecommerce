import { Request, Response } from 'express';
import { TipoUsuario } from '@prisma/client';
import { prisma } from '../database/prisma';

interface LinhaCarrinho {
  id_produto: number;
  quantidade: number;
}

const CUPONS_VALIDOS: Record<string, number> = {
  FIORE10: 10,
  BEMVINDO15: 15,
};
const FRETE_FIXO = 24.9;
const FRETE_GRATIS_ACIMA = 199;

export class PedidoController {
  static async finalizar(req: Request, res: Response) {
    if (req.session.user?.tipo_usuario !== TipoUsuario.CLIENTE) {
      return res.status(403).json({ message: 'Somente clientes podem finalizar compras.' });
    }

    const { itens: linhasRecebidas, cupom, cep } = req.body;
    if (!Array.isArray(linhasRecebidas) || linhasRecebidas.length === 0) {
      return res.status(400).json({ message: 'O carrinho está vazio.' });
    }

    let percentualDesconto = 0;
    if (cupom && typeof cupom === 'string' && cupom.trim()) {
      const codigoCupom = cupom.trim().toUpperCase();
      if (!(codigoCupom in CUPONS_VALIDOS)) {
        return res.status(400).json({ message: 'Cupom de desconto inválido ou expirado.' });
      }
      percentualDesconto = CUPONS_VALIDOS[codigoCupom];
    }

    let cepValido = false;
    if (cep && typeof cep === 'string' && cep.trim()) {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length !== 8) {
        return res.status(400).json({ message: 'CEP inválido. O CEP deve conter 8 dígitos numéricos.' });
      }
      cepValido = true;
    }

    const quantidades = new Map<number, number>();
    for (const linha of linhasRecebidas as LinhaCarrinho[]) {
      const id = Number(linha?.id_produto);
      const quantidade = Number(linha?.quantidade);
      if (!Number.isInteger(id) || id < 1 || !Number.isInteger(quantidade) || quantidade < 1) {
        return res.status(400).json({ message: 'Os produtos e quantidades do carrinho são inválidos.' });
      }
      quantidades.set(id, (quantidades.get(id) || 0) + quantidade);
    }

    try {
      const pedido = await prisma.$transaction(async (tx) => {
        const produtos = await tx.produto.findMany({
          where: { id_produto: { in: [...quantidades.keys()] } },
        });
        if (produtos.length !== quantidades.size) throw new Error('PRODUTO_NAO_ENCONTRADO');

        let totalItensCentavos = 0;
        for (const produto of produtos) {
          const quantidade = quantidades.get(produto.id_produto)!;
          const atualizacaoEstoque = await tx.produto.updateMany({
            where: {
              id_produto: produto.id_produto,
              quantidade_estoque: { gte: quantidade },
            },
            data: { quantidade_estoque: { decrement: quantidade } },
          });
          if (atualizacaoEstoque.count !== 1) throw new Error(`ESTOQUE_INSUFICIENTE:${produto.nome}`);
          totalItensCentavos += Math.round(Number(produto.preco) * 100) * quantidade;
        }

        const descontoCentavos =
          percentualDesconto > 0
            ? Math.round((totalItensCentavos * percentualDesconto) / 100)
            : 0;
        const subtotalComDescontoCentavos = totalItensCentavos - descontoCentavos;
        const subtotalComDescontoReais = subtotalComDescontoCentavos / 100;

        const freteGratis = subtotalComDescontoReais > FRETE_GRATIS_ACIMA;
        const freteCentavos = !freteGratis && cepValido ? Math.round(FRETE_FIXO * 100) : 0;

        const valorTotalFinal = (subtotalComDescontoCentavos + freteCentavos) / 100;

        return tx.pedido.create({
          data: {
            id_cliente: req.session.user!.id_usuario,
            valor_total: valorTotalFinal,
            itens: {
              create: produtos.map((produto) => ({
                id_produto: produto.id_produto,
                quantidade: quantidades.get(produto.id_produto)!,
                preco_unitario: Number(produto.preco),
              })),
            },
          },
          include: { itens: true },
        });
      });

      return res.status(201).json(pedido);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : '';
      if (mensagem === 'PRODUTO_NAO_ENCONTRADO') {
        return res.status(404).json({ message: 'Um ou mais produtos não estão mais disponíveis.' });
      }
      if (mensagem.startsWith('ESTOQUE_INSUFICIENTE:')) {
        return res.status(409).json({ message: `Estoque insuficiente para ${mensagem.split(':')[1]}.` });
      }
      console.error('Erro ao finalizar pedido:', erro);
      return res.status(500).json({ message: 'Não foi possível finalizar a compra.' });
    }
  }

  static async listarMeus(req: Request, res: Response) {
    if (req.session.user?.tipo_usuario !== TipoUsuario.CLIENTE) {
      return res.status(403).json({ message: 'Esta área é exclusiva para clientes.' });
    }

    try {
      const pedidos = await prisma.pedido.findMany({
        where: { id_cliente: req.session.user.id_usuario },
        include: { itens: { include: { produto: true } } },
        orderBy: { data_pedido: 'desc' },
      });
      return res.json(pedidos);
    } catch (erro) {
      console.error('Erro ao listar pedidos do cliente:', erro);
      return res.status(500).json({ message: 'Não foi possível carregar seus pedidos.' });
    }
  }
}
