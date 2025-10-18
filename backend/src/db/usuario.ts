import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Usuario } from "../types/db/Usuario.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["Email", "Telefono", "Nombre", "Apellido", "FotoUrl", "FechaNacimiento", "IdTipoUsuario"] as const;
const ALLOWED_UPDATE_FIELDS = ["Telefono", "Nombre", "Apellido", "FotoUrl", "FechaNacimiento"] as const;

export default class UsuarioDbService extends BaseDbService<Usuario, string> {
  constructor(readonly db: Pool) {
    super(db, "Usuario", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["Email"]);
  }

  //Crear un nuevo usuario
  public override async create(u: Usuario): Promise<boolean> {
    try {
      const [rows]: any = await this.db.query("CALL AgregarUsuario(?, ?, ?, ?, ?, ?, ?)", [
        u.Email ?? null,
        u.Telefono ?? null,
        u.Nombre ?? null,
        u.Apellido ?? null,
        u.FotoUrl ?? null,
        u.FechaNacimiento ?? null,
        u.IdTipoUsuario ?? null,
    ]);
    // El resultado real viene en rows[0][0]
    const resultado = rows?.[0]?.[0];
    console.log("Resultado SP:", resultado);

    return resultado?.codigo === 1;
    } catch (err) {
      console.error("Error al crear usuario:", err);
      return false;
    }
  }

  //Inicio de sesión.
  public async login(email: string, idTipoUsuario: number): Promise<Usuario | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE Email = ? AND IdTipoUsuario = ?`;
    const [rows] = await this.db.query<RowDataPacket[]>(sql, [email, idTipoUsuario]);
    const usuario = rows[0] as Usuario | undefined;

    if (!usuario) return null;
    return usuario;
  }

  //Actualización de los datos del usuario. 
  public override async update(id: string, cambios: Partial<Usuario>): Promise<boolean> {
  const sql = `
    UPDATE ${this.tableName}
    SET Telefono = ?, Nombre = ?, Apellido = ?, FotoUrl = ?, FechaNacimiento = ?
    WHERE Email = ?
  `;
  const [result] = await this.db.query<ResultSetHeader>(sql, [
    cambios.Telefono ?? null,
    cambios.Nombre ?? null,
    cambios.Apellido ?? null,
    cambios.FotoUrl ?? null,
    cambios.FechaNacimiento ?? null,
    id
  ]);
  return result.affectedRows > 0;
  }
}
