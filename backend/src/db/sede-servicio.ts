import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { SedeServicio } from "../types/db/SedeServicio.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["IdSede", "IdServicio", "Descripcion", "Capacidad", "Precio", "HoraInicio", "HoraFinal"] as const;
const ALLOWED_UPDATE_FIELDS = ["Descripcion", "Capacidad", "Precio", "HoraInicio", "HoraFinal"] as const; // para nunca actualizar "IdSede" y "IdServicio"

export default class SedeServicioDbService extends BaseDbService<SedeServicio, { IdSede: number, IdServicio: number }> {
	constructor(readonly db: Pool) {
		super(db, "SedeServicio", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["IdSede", "IdServicio"])
	}

	// Crea un registro de servicio de una sede. Requiere formato TIME 'HH:MM:SS'
	public override async create(sedeServicio: SedeServicio): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`CALL InsertarSedeServicioUnico(?, ?, ?, ?, ?, ?, ?)`,
			[sedeServicio.IdSede, sedeServicio.IdServicio, sedeServicio.Descripcion, sedeServicio.Capacidad, sedeServicio.Precio, sedeServicio.HoraInicio, sedeServicio.HoraFinal]
		);
		return result.affectedRows > 0;
	}
}