export class Categoria {
  private _id_categoria?: number;
  private _nome: string;

  constructor(nome: string, id_categoria?: number) {
    this._nome = nome;
    this._id_categoria = id_categoria;
  }

  // Getters & Setters
  public get id_categoria(): number | undefined {
    return this._id_categoria;
  }

  public set id_categoria(value: number | undefined) {
    this._id_categoria = value;
  }

  public get nome(): string {
    return this._nome;
  }

  public set nome(value: string) {
    this._nome = value;
  }

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_categoria !== undefined && { id_categoria: this._id_categoria }),
      nome: this._nome,
    };
  }

  /**
   * Retorna a representação em JSON
   */
  public toJSON() {
    return {
      id_categoria: this._id_categoria,
      nome: this._nome,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_categoria?: number;
    nome: string;
  }): Categoria {
    return new Categoria(data.nome, data.id_categoria);
  }
}
