import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { SedeServicio } from "../types/db/SedeServicio.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = [
  "Id", "Descripcion", "Capacidad", "Precio", "HoraInicio", "HoraFinal", "Estatus", "IdSede", "IdServicio"] as const;
const ALLOWED_UPDATE_FIELDS = ["Descripcion", "Capacidad", "Precio", "HoraInicio", "HoraFinal", "Estatus"] as const; // para nunca actualizar "IdSede" y "IdServicio"

export default class SedeServicioDbService extends BaseDbService<SedeServicio, number> {
	constructor(readonly db: Pool) {
		super(db, "SedeServicio", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["Id"])
	}

	// Crea un registro de servicio de una sede. Requiere formato TIME 'HH:MM:SS'
	public override async create(s: SedeServicio): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO SedeServicio
			(Descripcion, Capacidad, Precio, HoraInicio, HoraFinal, Estatus, IdSede, IdServicio)
			VALUES (?,?,?,?,?,?,?,?)`,
			[
				s.Descripcion ?? null,
				s.Capacidad ?? null,
				s.Precio ?? null,
				s.HoraInicio ?? null,
				s.HoraFinal ?? null,
				s.Estatus === undefined || s.Estatus === null ? null : Number(s.Estatus), // boolean -> 0/1
				s.IdSede ?? null,
				s.IdServicio ?? null,
			]
		);
		return result.affectedRows > 0;
	}
}