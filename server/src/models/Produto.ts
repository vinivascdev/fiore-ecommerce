export class Produto {
  private _id_produto?: number;
  private _id_categoria: number;
  private _nome: string;
  private _descricao_olfativa: string;
  private _preco: number;
  private _quantidade_estoque: number;
  private _imagem_url: string;

  constructor(
    id_categoria: number,
    nome: string,
    descricao_olfativa: string,
    preco: number,
    quantidade_estoque: number,
    imagem_url: string,
    id_produto?: number
  ) {
    this._id_categoria = id_categoria;
    this._nome = nome;
    this._descricao_olfativa = descricao_olfativa;
    this._preco = Number(preco);
    this._quantidade_estoque = quantidade_estoque;
    this._imagem_url = imagem_url;
    this._id_produto = id_produto;
  }

  // Getters & Setters
  public get id_produto(): number | undefined {
    return this._id_produto;
  }

  public set id_produto(value: number | undefined) {
    this._id_produto = value;
  }

  public get id_categoria(): number {
    return this._id_categoria;
  }

  public set id_categoria(value: number) {
    this._id_categoria = value;
  }

  public get nome(): string {
    return this._nome;
  }

  public set nome(value: string) {
    this._nome = value;
  }

  public get descricao_olfativa(): string {
    return this._descricao_olfativa;
  }

  public set descricao_olfativa(value: string) {
    this._descricao_olfativa = value;
  }

  public get preco(): number {
    return this._preco;
  }

  public set preco(value: number) {
    this._preco = Number(value);
  }

  public get quantidade_estoque(): number {
    return this._quantidade_estoque;
  }

  public set quantidade_estoque(value: number) {
    this._quantidade_estoque = value;
  }

  public get imagem_url(): string {
    return this._imagem_url;
  }

  public set imagem_url(value: string) {
    this._imagem_url = value;
  }

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_produto !== undefined && { id_produto: this._id_produto }),
      id_categoria: this._id_categoria,
      nome: this._nome,
      descricao_olfativa: this._descricao_olfativa,
      preco: this._preco,
      quantidade_estoque: this._quantidade_estoque,
      imagem_url: this._imagem_url,
    };
  }

  /**
   * Retorna a representação em JSON
   */
  public toJSON() {
    return {
      id_produto: this._id_produto,
      id_categoria: this._id_categoria,
      nome: this._nome,
      descricao_olfativa: this._descricao_olfativa,
      preco: this._preco,
      quantidade_estoque: this._quantidade_estoque,
      imagem_url: this._imagem_url,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_produto?: number;
    id_categoria: number;
    nome: string;
    descricao_olfativa: string;
    preco: number | string | { toNumber?: () => number };
    quantidade_estoque: number;
    imagem_url: string;
  }): Produto {
    const numericPreco =
      typeof data.preco === 'object' && data.preco && 'toNumber' in data.preco
        ? (data.preco as { toNumber: () => number }).toNumber()
        : Number(data.preco);

    return new Produto(
      data.id_categoria,
      data.nome,
      data.descricao_olfativa,
      numericPreco,
      data.quantidade_estoque,
      data.imagem_url,
      data.id_produto
    );
  }
}
