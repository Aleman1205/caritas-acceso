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

 // Crear una nueva compra usando el stored procedure CompraDeServicio.
  public override async create(c: Compra): Promise<boolean> {
    try {
      const [result] = await this.db.query<ResultSetHeader>(
        "CALL CompraDeServicio(?, ?, ?, ?, ?)",
        [
          c.IdTransaccion ?? null,
          c.Total ?? null,
          c.Fecha ?? null,
          c.IdSede ?? null,
          c.IdServicio ?? null,
        ]
      );

      return (result as any).affectedRows > 0;
    } catch (err) {
      console.error("Error al registrar compra:", err);
      return false;
    }
  }

  //Actualiza los datos de una compra.
  public override async update(id: string, cambios: Partial<Compra>): Promise<boolean> {
    const sql = `
      UPDATE ${this.tableName}
      SET Total = ?, Fecha = ?
      WHERE IdTransaccion = ?
    `;

    const [result] = await this.db.query<ResultSetHeader>(sql, [
      cambios.Total ?? null,
      cambios.Fecha ?? null,
      cambios.IdTransaccion,
    ]);

    return result.affectedRows > 0;
  }
}
