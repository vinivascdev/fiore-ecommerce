import { TipoUsuario } from './TipoUsuario';

export class Usuario {
  private _id_usuario?: number;
  private _nome: string;
  private _email: string;
  private _login: string;
  private _senha: string;
  private _endereco: string;
  private _tipo_usuario: TipoUsuario;

  constructor(
    nome: string,
    email: string,
    login: string,
    senha: string,
    endereco: string,
    tipo_usuario: TipoUsuario = TipoUsuario.CLIENTE,
    id_usuario?: number
  ) {
    this._nome = nome;
    this._email = email;
    this._login = login;
    this._senha = senha;
    this._endereco = endereco;
    this._tipo_usuario = tipo_usuario;
    this._id_usuario = id_usuario;
  }

  // Getters & Setters
  public get id_usuario(): number | undefined {
    return this._id_usuario;
  }

  public set id_usuario(value: number | undefined) {
    this._id_usuario = value;
  }

  public get nome(): string {
    return this._nome;
  }

  public set nome(value: string) {
    this._nome = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get login(): string {
    return this._login;
  }

  public set login(value: string) {
    this._login = value;
  }

  public get senha(): string {
    return this._senha;
  }

  public set senha(value: string) {
    this._senha = value;
  }

  public get endereco(): string {
    return this._endereco;
  }

  public set endereco(value: string) {
    this._endereco = value;
  }

  public get tipo_usuario(): TipoUsuario {
    return this._tipo_usuario;
  }

  public set tipo_usuario(value: TipoUsuario) {
    this._tipo_usuario = value;
  }

  /**
   * Retorna os dados formatados para persistência no Prisma
   */
  public toPersistence() {
    return {
      ...(this._id_usuario !== undefined && { id_usuario: this._id_usuario }),
      nome: this._nome,
      email: this._email,
      login: this._login,
      senha: this._senha,
      endereco: this._endereco,
      tipo_usuario: this._tipo_usuario,
    };
  }

  /**
   * Retorna a representação pública em JSON
   */
  public toJSON() {
    return {
      id_usuario: this._id_usuario,
      nome: this._nome,
      email: this._email,
      login: this._login,
      endereco: this._endereco,
      tipo_usuario: this._tipo_usuario,
    };
  }

  /**
   * Cria uma instância a partir de dados recuperados do banco/Prisma
   */
  public static fromPersistence(data: {
    id_usuario?: number;
    nome: string;
    email: string;
    login: string;
    senha: string;
    endereco: string;
    tipo_usuario: TipoUsuario | string;
  }): Usuario {
    return new Usuario(
      data.nome,
      data.email,
      data.login,
      data.senha,
      data.endereco,
      data.tipo_usuario as TipoUsuario,
      data.id_usuario
    );
  }
}
