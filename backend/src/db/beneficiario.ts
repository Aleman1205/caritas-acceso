import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Beneficiario } from "../types/db/beneficiario.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["Telefono", "IdTransaccion", "Nombre", "Apellido", "Email"] as const;
const ALLOWED_UPDATE_FIELDS = ["Nombre", "Apellido", "Email"] as const;

export default class BeneficiarioDbService extends BaseDbService<Beneficiario, string> {
	constructor(readonly db: Pool) {
		super(db, "Beneficiario", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["Telefono", "IdTransaccion"]);
	}

	//Crea un beneficiario
	public override async create(beneficiario: Beneficiario): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO Beneficiario (Telefono, IdTransaccion, Nombre, Apellido, Email)
			 VALUES (?, ?, ?, ?, ?);`,
			[
				beneficiario.Telefono,
				beneficiario.IdTransaccion ?? null,
				beneficiario.Nombre ?? null,
				beneficiario.Apellido ?? null,
				beneficiario.Email ?? null
			]
		);
		return result.affectedRows > 0;
	}

	//Obtener beneficiarios por filtros (por ejemplo por IdTransaccion)
	public async getMany(filters: Partial<Beneficiario>): Promise<Beneficiario[]> {
		const whereClauses = Object.keys(filters)
			.map((key) => `${key} = ?`)
			.join(" AND ");

		const values = Object.values(filters);
		const [rows] = await this.db.query<RowDataPacket[]>(
			`SELECT * FROM Beneficiario ${whereClauses ? `WHERE ${whereClauses}` : ""};`,
			values
		);

		return rows as Beneficiario[];
	}

	//Eliminar beneficiarios por filtros (por ejemplo Telefono + IdTransaccion)
	public async delete(filters: Partial<Beneficiario>): Promise<boolean> {
		const whereClauses = Object.keys(filters)
			.map((key) => `${key} = ?`)
			.join(" AND ");

		const values = Object.values(filters);
		const [result] = await this.db.query<ResultSetHeader>(
			`DELETE FROM Beneficiario WHERE ${whereClauses};`,
			values
		);

		return result.affectedRows > 0;
	}
}
