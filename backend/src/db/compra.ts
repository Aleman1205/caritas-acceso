import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Compra } from "../types/db/Compra.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = [
  "IdTransaccion", "Total", "Fecha", "IdSede", "IdServicio"
] as const;
const ALLOWED_UPDATE_FIELDS = ["Total", "Fecha"] as const; 

export default class CompraDbService extends BaseDbService<Compra, string> {
  constructor(readonly db: Pool) {
    super(db, "Compra", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["IdTransaccion"]);
  }

  // Crea un registro de compra.
  public override async create(c: Compra): Promise<boolean> {
    const sql = `
      INSERT INTO ${this.tableName}
      (IdTransaccion, Total, Fecha, IdSede, IdServicio)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await this.db.query<ResultSetHeader>(sql, [
      c.IdTransaccion ?? null,
      c.Total ?? null,
      c.Fecha ?? null,        
      c.IdSede ?? null,
      c.IdServicio ?? null,
    ]);

    return result.affectedRows > 0;
  }

  //Actualiza los datos de una compra.
  public override async update(c: Compra): Promise<boolean> {
    const sql = `
      UPDATE ${this.tableName}
      SET Total = ?, Fecha = ?
      WHERE IdTransaccion = ?
    `;

    const [result] = await this.db.query<ResultSetHeader>(sql, [
      c.Total ?? null,
      c.Fecha ?? null,
      c.IdTransaccion,
    ]);

    return result.affectedRows > 0;
  }
}
