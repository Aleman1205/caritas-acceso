import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

export default abstract class BaseDbService<T> {
	constructor(
		protected db: Pool,
		protected tableName: string,
		protected allowedFields: readonly string[],
		protected allowedUpdateFields: readonly string[]
	) {}

	public abstract create(objeto: T): Promise<boolean>;

	// Puede obtener uno con el ID unicamente y/o los atributos
	public async getAll(filtros?: Partial<T>): Promise<T[]> {
		const clean = Object.entries(filtros || {})
		.filter(([campo, value]) =>
			this.allowedFields.includes(campo) &&
			value !== undefined && value !== null && value !== ""
		);

		const campos = clean.map(([campo]) => campo);
		const valores = clean.map(([_, value]) => value);

		let query = `SELECT * FROM ${this.tableName}`;
		if (campos.length > 0) {
		const whereClause = campos.map(campo => `${campo} = ?`).join(" AND ");
		query += ` WHERE ${whereClause}`;
		}

		const [rows] = await this.db.query(query, valores);
		return rows as RowDataPacket[] as T[];
	}

	public async update(Id: number, cambios: Partial<T>): Promise<boolean> {
		const clean = Object.entries(cambios || {})
		.filter(([campo, value]) =>
			this.allowedUpdateFields.includes(campo) &&
			value !== undefined && value !== null && value !== ""
		);

		if (clean.length === 0) return false;

		const campos = clean.map(([campo]) => campo);
		const valores = clean.map(([_, value]) => value);

		const setClause = campos.map(campo => `${campo} = ?`).join(", ");
		const [result] = await this.db.query<ResultSetHeader>(
		`UPDATE ${this.tableName} SET ${setClause} WHERE Id = ?`,
		[...valores, Id]
		);

		return result.affectedRows > 0;
	}

	public async deleteMany(ids: number[]): Promise<number> {
		const cleanIds = (ids || []).filter(
		(id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0
		);
		if (cleanIds.length === 0) return 0;

		const placeholders = cleanIds.map(() => "?").join(", ");
		const [result] = await this.db.query<ResultSetHeader>(
		`DELETE FROM ${this.tableName} WHERE Id IN (${placeholders})`,
		cleanIds
		);
		return result.affectedRows;
	}
}