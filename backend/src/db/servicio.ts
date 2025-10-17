import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Servicio } from "../types/db/servicio.js";
import BaseDbService from "./base.js";

const ALLOWED_FIELDS = ["Id", "Nombre", "Descripcion", "Estatus"] as const;
const ALLOWED_UPDATE_FIELDS = ["Nombre", "Descripcion", "Estatus"] as const; // para nunca actualizar "Id"

export default class ServicioDbService extends BaseDbService<Servicio, number> {
	constructor(readonly db: Pool) {
        super(db, "Servicio", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["Id"])
    }

	// Crea un servicio
	public override async create(servicio: Servicio): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`CALL InsertarServicioUnico(?, ?, ?)`,
			[servicio.Nombre, servicio.Descripcion, servicio.Estatus]
		);
		return result.affectedRows > 0;
	}
}