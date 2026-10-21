export class Pedido {
  private _id_pedido?: number;
  private _id_cliente: number;
  private _data_pedido: Date;
  private _valor_total: number;

  constructor(
    id_cliente: number,
    valor_total: number,
    data_pedido: Date = new Date(),
    id_pedido?: number
  ) {
    this._id_cliente = id_cliente;
    this._valor_total = Number(valor_total);
    this._data_pedido = data_pedido;
    this._id_pedido = id_pedido;
  }

  // Getters & Setters
  public get id_pedido(): number | undefined {
    return this._id_pedido;
  }

  public set id_pedido(value: number | undefined) {
    this._id_pedido = value;
  }

  public get id_cliente(): number {
    return this._id_cliente;
  }

  public set id_cliente(value: number) {
    this._id_cliente = value;
  }

  public get data_pedido(): Date {
    return this._data_pedido;
  }

  public set data_pedido(value: Date) {
    this._data_pedido = value;
  }

  public get valor_total(): number {
    return this._valor_total;
  }

  public set valor_total(value: number) {
    this._valor_total = Number(value);
  }

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_pedido !== undefined && { id_pedido: this._id_pedido }),
      id_cliente: this._id_cliente,
      data_pedido: this._data_pedido,
      valor_total: this._valor_total,
    };
  }

  /**
   * Retorna a representação em JSON
   */
  public toJSON() {
    return {
      id_pedido: this._id_pedido,
      id_cliente: this._id_cliente,
      data_pedido: this._data_pedido.toISOString(),
      valor_total: this._valor_total,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_pedido?: number;
    id_cliente: number;
    data_pedido?: Date | string;
    valor_total: number | string | { toNumber?: () => number };
  }): Pedido {
    const numericTotal =
      typeof data.valor_total === 'object' && data.valor_total && 'toNumber' in data.valor_total
        ? (data.valor_total as { toNumber: () => number }).toNumber()
        : Number(data.valor_total);

    const dataPedido = data.data_pedido ? new Date(data.data_pedido) : new Date();

    return new Pedido(
      data.id_cliente,
      numericTotal,
      dataPedido,
      data.id_pedido
    );
  }
}
