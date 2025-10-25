import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type Compra from "../types/db/compra.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = [
	"IdTransaccion",
	"Total",
	"Fecha",
	"IdSede",
	"IdServicio",
] as const;

const ALLOWED_UPDATE_FIELDS = ["Total", "Fecha"] as const;

export default class CompraDbService extends BaseDbService<Compra, string> {
	constructor(readonly db: Pool) {
		super(db, "Compra", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, [
			"IdTransaccion",
		]);
	}

	// Crear compra
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

	// ✅ Nuevo método: obtener una compra específica por IdTransaccion
	public async getById(id: string): Promise<Compra | null> {
		const [rows] = await this.db.query<RowDataPacket[]>(
			`SELECT * FROM ${this.tableName} WHERE IdTransaccion = ?`,
			[id]
		);
		return rows.length > 0 ? (rows[0] as Compra) : null;
	}

	// Actualizar compra — firma igual a la clase base
	public override async update(
		id: string,
		cambios: Partial<Compra>
	): Promise<boolean> {
		const fields: string[] = [];
		const values: any[] = [];

		if (cambios.Total !== undefined) {
			fields.push("Total = ?");
			values.push(cambios.Total);
		}

		if (cambios.Fecha !== undefined) {
			fields.push("Fecha = ?");
			values.push(cambios.Fecha);
		}

		if (fields.length === 0) return false;

		const sql = `
      UPDATE ${this.tableName}
      SET ${fields.join(", ")}
      WHERE IdTransaccion = ?
    `;

		values.push(id);
		const [result] = await this.db.query<ResultSetHeader>(sql, values);

		return result.affectedRows > 0;
	}
}
