export class ItemPedido {
  private _id_item_pedido?: number;
  private _id_pedido: number;
  private _id_produto: number;
  private _quantidade: number;
  private _preco_unitario: number;

  constructor(
    id_pedido: number,
    id_produto: number,
    quantidade: number,
    preco_unitario: number,
    id_item_pedido?: number
  ) {
    this._id_pedido = id_pedido;
    this._id_produto = id_produto;
    this._quantidade = quantidade;
    this._preco_unitario = Number(preco_unitario);
    this._id_item_pedido = id_item_pedido;
  }

  // Getters & Setters
  public get id_item_pedido(): number | undefined {
    return this._id_item_pedido;
  }

  public set id_item_pedido(value: number | undefined) {
    this._id_item_pedido = value;
  }

  public get id_pedido(): number {
    return this._id_pedido;
  }

  public set id_pedido(value: number) {
    this._id_pedido = value;
  }

  public get id_produto(): number {
    return this._id_produto;
  }

  public set id_produto(value: number) {
    this._id_produto = value;
  }

  public get quantidade(): number {
    return this._quantidade;
  }

  public set quantidade(value: number) {
    this._quantidade = value;
  }

  public get preco_unitario(): number {
    return this._preco_unitario;
  }

  public set preco_unitario(value: number) {
    this._preco_unitario = Number(value);
  }

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_item_pedido !== undefined && { id_item_pedido: this._id_item_pedido }),
      id_pedido: this._id_pedido,
      id_produto: this._id_produto,
      quantidade: this._quantidade,
      preco_unitario: this._preco_unitario,
    };
  }

  /**
   * Retorna a representação em JSON
   */
  public toJSON() {
    return {
      id_item_pedido: this._id_item_pedido,
      id_pedido: this._id_pedido,
      id_produto: this._id_produto,
      quantidade: this._quantidade,
      preco_unitario: this._preco_unitario,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_item_pedido?: number;
    id_pedido: number;
    id_produto: number;
    quantidade: number;
    preco_unitario: number | string | { toNumber?: () => number };
  }): ItemPedido {
    const numericPreco =
      typeof data.preco_unitario === 'object' && data.preco_unitario && 'toNumber' in data.preco_unitario
        ? (data.preco_unitario as { toNumber: () => number }).toNumber()
        : Number(data.preco_unitario);

    return new ItemPedido(
      data.id_pedido,
      data.id_produto,
      data.quantidade,
      numericPreco,
      data.id_item_pedido
    );
  }
}
