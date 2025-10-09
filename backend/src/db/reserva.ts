import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Reserva } from "../types/db/Reserva.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["IdTransaccion", "FechaInicio", "FechaSalida", "NumeroPersonas", "IdSede"] as const;
const ALLOWED_UPDATE_FIELDS = ["FechaInicio", "FechaSalida", "NumeroPersonas", "IdSede"] as const;

export default class ReservaDbService extends BaseDbService<Reserva, string> {
	constructor(readonly db: Pool) {
		super(db, "Reserva", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["IdTransaccion"]);
	}

	// Crea una reserva
	public override async create(reserva: Reserva): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO Reserva (IdTransaccion, FechaInicio, FechaSalida, NumeroPersonas, IdSede)
			 VALUES (?, ?, ?, ?, ?);`,
			[
				reserva.IdTransaccion,
				reserva.FechaInicio,
				reserva.FechaSalida,
				reserva.NumeroPersonas,
				reserva.IdSede
			]
		);
		return result.affectedRows > 0;
	}

	// Obtener reservas por filtros (por ejemplo por IdTransaccion)
	public async getMany(filters: Partial<Reserva>): Promise<Reserva[]> {
		const whereClauses = Object.keys(filters)
			.map((key) => `${key} = ?`)
			.join(" AND ");

		const values = Object.values(filters);
		const [rows] = await this.db.query<RowDataPacket[]>(
			`SELECT * FROM Reserva ${whereClauses ? `WHERE ${whereClauses}` : ""};`,
			values
		);

		return rows as Reserva[];
	}

	// Eliminar reservas por filtros (por ejemplo IdTransaccion)
	public async delete(filters: Partial<Reserva>): Promise<boolean> {
		const whereClauses = Object.keys(filters)
			.map((key) => `${key} = ?`)
			.join(" AND ");

		const values = Object.values(filters);
		const [result] = await this.db.query<ResultSetHeader>(
			`DELETE FROM Reserva WHERE ${whereClauses};`,
			values
		);

		return result.affectedRows > 0;
	}
}
