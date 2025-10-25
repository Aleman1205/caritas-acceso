import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Parada } from "../types/db/parada.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["Id", "Nombre", "Descripcion", "Ubicacion", "Estatus"] as const;
const ALLOWED_UPDATE_FIELDS = ["Nombre", "Descripcion", "Ubicacion", "Estatus"] as const;

export default class ParadaDbService extends BaseDbService<Parada, number> {
	constructor(readonly db: Pool) {
		super(db, "Parada", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["Id"]);
	}

	// Crea una parada
	public override async create(parada: Parada): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`CALL InsertarParadaUnica(?, ?, ?, ?);`,
			[parada.Nombre, parada.Descripcion ?? null, parada.Ubicacion, parada.Estatus ?? true]
		);
		return result.affectedRows > 0;
	}
}