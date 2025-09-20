import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Sede } from "../types/db/Sede.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["Id", "Nombre", "Ubicacion", "Ciudad", "HoraInicio", "HoraFinal", "Descripcion"] as const;
const ALLOWED_UPDATE_FIELDS = ["Nombre", "Ubicacion", "Ciudad", "HoraInicio", "HoraFinal", "Descripcion"] as const; // para nunca actualizar "Id"

type AllowedField = typeof ALLOWED_FIELDS[number];
type AllowedUpdateField = typeof ALLOWED_UPDATE_FIELDS[number];

export default class SedeDbService extends BaseDbService<Sede> {
	constructor(readonly db: Pool) {
		super(db, "Sede", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS)
	}

	// Crea una sede. Requiere formato TIME 'HH:MM:SS'
	public override async create(sede: Sede): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`CALL InsertarSedeUnica(?, ?, ?, ?, ?, ?);`,
			[sede.Nombre, sede.Ubicacion, sede.Ciudad, sede.HoraInicio, sede.HoraFinal, sede.Descripcion ?? null]
		);
		return result.affectedRows > 0;
	}
}