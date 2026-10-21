export class CarrinhoItem {
  private _id_carrinho_item?: number;
  private _session_id: string;
  private _id_produto: number;
  private _quantidade: number;

  constructor(
    session_id: string,
    id_produto: number,
    quantidade: number,
    id_carrinho_item?: number
  ) {
    this._session_id = session_id;
    this._id_produto = id_produto;
    this._quantidade = quantidade;
    this._id_carrinho_item = id_carrinho_item;
  }

  // Getters & Setters
  public get id_carrinho_item(): number | undefined {
    return this._id_carrinho_item;
  }

  public set id_carrinho_item(value: number | undefined) {
    this._id_carrinho_item = value;
  }

  public get session_id(): string {
    return this._session_id;
  }

  public set session_id(value: string) {
    this._session_id = value;
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

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_carrinho_item !== undefined && { id_carrinho_item: this._id_carrinho_item }),
      session_id: this._session_id,
      id_produto: this._id_produto,
      quantidade: this._quantidade,
    };
  }

  /**
   * Retorna a representação em JSON
   */
  public toJSON() {
    return {
      id_carrinho_item: this._id_carrinho_item,
      session_id: this._session_id,
      id_produto: this._id_produto,
      quantidade: this._quantidade,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_carrinho_item?: number;
    session_id: string;
    id_produto: number;
    quantidade: number;
  }): CarrinhoItem {
    return new CarrinhoItem(
      data.session_id,
      data.id_produto,
      data.quantidade,
      data.id_carrinho_item
    );
  }
}
