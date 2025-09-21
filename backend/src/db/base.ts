import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { Key } from "../types/key.js";
import { isPrimitiveKey } from "../types/key.js";

export default abstract class BaseDbService<T, K extends Key = number> {
	constructor(
		protected db: Pool,
		protected tableName: string,
		protected allowedFields: readonly string[],
		protected allowedUpdateFields: readonly string[],
		protected keyColumns: readonly string[] = ["Id"] // por defecto
	) {}

	public abstract create(objeto: T): Promise<boolean>;

	public async getAll(filtros?: Partial<T>): Promise<T[]> {
		const clean = Object.entries(filtros || {}).filter(
		([campo, value]) =>
			this.allowedFields.includes(campo) &&
			value !== undefined &&
			value !== null &&
			value !== ""
		);

		const campos = clean.map(([campo]) => campo);
		const valores = clean.map(([_, value]) => value);

		let query = `SELECT * FROM ${this.tableName}`;
		if (campos.length > 0) {
			const whereClause = campos.map((campo) => `${campo} = ?`).join(" AND ");
			query += ` WHERE ${whereClause}`;
		}

		const [rows] = await this.db.query(query, valores);
		return rows as RowDataPacket[] as T[];
	}

	public async update(id: K, cambios: Partial<T>): Promise<boolean> {
		// Sanitiza cambios según allowedUpdateFields
		const clean = Object.entries(cambios || {}).filter(
		([campo, value]) =>
			this.allowedUpdateFields.includes(campo) &&
			value !== undefined &&
			value !== null &&
			value !== ""
		);
		if (clean.length === 0) return false;

		const campos = clean.map(([campo]) => campo);
		const valores = clean.map(([_, value]) => value);
		const setClause = campos.map((campo) => `${campo} = ?`).join(", ");

		// WHERE por llave (simple o compuesta)
		const { where, params } = this.buildWhereForKey(id);

		const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${where}`;
		const [result] = await this.db.query<ResultSetHeader>(sql, [...valores, ...params]);
		return result.affectedRows > 0;
	}

	public async deleteMany(ids: K[]): Promise<number> {
		if (!Array.isArray(ids) || ids.length === 0) return 0;

		// Filtra ids válidos (por si vienen undefined/null)
		const validIds = ids.filter((k) => (isPrimitiveKey(k) ? k !== undefined && k !== null : k && typeof k === "object"));
		if (validIds.length === 0) return 0;

		let sql: string;
		let params: any[] = [];

		if (this.keyColumns.length === 1) {
			// Caso simple: DELETE ... WHERE Id IN (?,?,?)
			const col = this.keyColumns[0];
			const placeholders = validIds.map(() => "?").join(", ");
			sql = `DELETE FROM ${this.tableName} WHERE ${col} IN (${placeholders})`;
			params = validIds as (number | string)[];
		} else {
			// Caso compuesto: OR de grupos ( (A=? AND B=?) OR (A=? AND B=?) ... )
			const group = `(${this.keyColumns.map((c) => `${c} = ?`).join(" AND ")})`;
			const where = new Array(validIds.length).fill(group).join(" OR ");
			sql = `DELETE FROM ${this.tableName} WHERE ${where}`;

			for (const k of validIds) {
				// k es objeto con las columnas de keyColumns
				for (const col of this.keyColumns) {
					params.push((k as Record<string, any>)[col]);
				}
			}
		}

		const [result] = await this.db.query<ResultSetHeader>(sql, params);
		return result.affectedRows;
	}

	protected buildWhereForKey(id: K): { where: string; params: any[] } {
		if (this.keyColumns.length === 1) {
			const col = this.keyColumns[0]!;
			const val = isPrimitiveKey(id) ? id : (id as Record<string, any>)[col];
			return { where: `${col} = ?`, params: [val] };
		}
		// Compuesta
		const where = this.keyColumns.map((c) => `${c} = ?`).join(" AND ");
		const params = this.keyColumns.map((c) => (id as Record<string, any>)[c]);
		return { where, params };
	}
}
