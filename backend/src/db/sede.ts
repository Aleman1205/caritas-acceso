import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Sede, SedeDTO } from "../types/db/Sede.js";

const ALLOWED_FIELDS = ["Id", "Nombre", "Ubicacion", "Ciudad", "HoraInicio", "HoraFinal", "Descripcion"] as const;
const ALLOWED_UPDATE_FIELDS = ["Nombre", "Ubicacion", "Ciudad", "HoraInicio", "HoraFinal", "Descripcion"] as const; // para nunca actualizar "Id"

type AllowedField = typeof ALLOWED_FIELDS[number];
type AllowedUpdateField = typeof ALLOWED_UPDATE_FIELDS[number];

export default class SedeDbService {
	constructor(private db: Pool) {}

	// Crea una sede. Requiere formato TIME 'HH:MM:SS'
	public async createSede(sede: SedeDTO): Promise<boolean> {
		const [result] = await this.db.query<ResultSetHeader>(
			`INSERT INTO Sede (Nombre, Ubicacion, Ciudad, HoraInicio, HoraFinal, Descripcion)
             VALUES (?, ?, ?, ?, ?, ?)`,
			[sede.Nombre, sede.Ubicacion, sede.Ciudad, sede.HoraInicio, sede.HoraFinal, sede.Descripcion ?? null]
		);
		return result.affectedRows > 0;
	}

	// Lista sedes con filtros whitelisteados
	public async getSedes(filtros?: Partial<SedeDTO>): Promise<Sede[]> {
		const clean = Object.entries(filtros || {})
			.filter(([campo, value]) => (ALLOWED_FIELDS as readonly string[]).includes(campo) && value !== undefined && value !== null && value !== "");

		const campos = clean.map(([campo]) => campo as AllowedField);
		const valores = clean.map(([_, value]) => value);

		let query = "SELECT * FROM Sede";
		if (campos.length > 0) {
			const whereClause = campos.map(campo => `${campo} = ?`).join(" AND ");
			query += ` WHERE ${whereClause}`;
		}

		const [rows] = await this.db.query<Sede[]>(query, valores);
		return rows;
	}

	// Actualiza campos permitidos; ignora vacíos
	public async updateSede(Id: number, cambios: Partial<SedeDTO>): Promise<boolean> {
		const clean = Object.entries(cambios || {})
			.filter(([campo, value]) =>
				(ALLOWED_UPDATE_FIELDS as readonly string[]).includes(campo) && value !== undefined && value !== null && value !== ""
			);

		if (clean.length === 0) return false;

		const campos = clean.map(([campo]) => campo as AllowedUpdateField);
		const valores = clean.map(([_, value]) => value);

		const setClause = campos.map(campo => `${campo} = ?`).join(", ");

		const [result] = await this.db.query<ResultSetHeader>(
			`UPDATE Sede SET ${setClause} WHERE Id = ?`,
			[...valores, Id]
		);

		return result.affectedRows > 0;
	}

	// Elimina múltiples ids válidos (>0)
	public async deleteSedes(ids: number[]): Promise<number> {
		const cleanIds = (ids || []).filter(
			(id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0
		);
		if (cleanIds.length === 0) return 0;

		const placeholders = cleanIds.map(() => "?").join(", ");
		const [result] = await this.db.query<ResultSetHeader>(
			`DELETE FROM Sede WHERE Id IN (${placeholders})`,
			cleanIds
		);
		return result.affectedRows;
	}
}