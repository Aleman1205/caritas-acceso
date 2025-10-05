import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { Key } from "../types/key.js";
import { isPrimitiveKey } from "../types/key.js";

export type FKDependency =
  // FK simple en la tabla hija (ej: Hijo.IdPadre -> Padre.Id)
  { table: string; fk: string } |
  // FK compuesta: map { columnaPadre: columnaHija }
  { table: string; fkMap: Record<string, string> };

export default abstract class BaseDbService<T, K extends Key = number> {
	constructor(
		protected db: Pool,
		protected tableName: string,
		protected allowedFields: readonly string[],
		protected allowedUpdateFields: readonly string[],
		protected keyColumns: readonly string[] = ["Id"], // por defecto
		protected dependencies: FKDependency[] = []
	) {}

	protected buildNoDependencyGuards(parentAlias = "p"): string {
		if (!this.dependencies.length) return "";

		const guards = this.dependencies.map((dep) => {
			if ("fk" in dep) {
				// llave simple: hijo.fk = padre.Id
				if (this.keyColumns.length !== 1) {
					throw new Error(`Dependencia ${dep.table} declarada con 'fk' pero la llave del padre es compuesta.`);
				}
				const parentCol = this.keyColumns[0]!;
				return `NOT EXISTS (SELECT 1 FROM ${dep.table} d WHERE d.${dep.fk} = ${parentAlias}.${parentCol})`;
			} else {
				// llave compuesta: d[fkMap[colPadre]] = p[colPadre] para cada col de la llave
				const conds = this.keyColumns
					.map((pc) => `d.${dep.fkMap[pc]} = ${parentAlias}.${pc}`)
					.join(" AND ");
				return `NOT EXISTS (SELECT 1 FROM ${dep.table} d WHERE ${conds})`;
			}
		});

		return guards.length ? " AND " + guards.join(" AND ") : "";
	}

	protected async buildNoDependencyGuardsAuto(parentAlias = "p"): Promise<string> {
	// Si hay dependencias manuales, respétalas
	if (this.dependencies.length > 0) {
		return this.buildNoDependencyGuards(parentAlias);
	}

	// Descubrir FKs reales y AGRUPAR por constraint para soportar compuestas
	const [rows] = await this.db.query<RowDataPacket[]>(`
		SELECT
		rc.CONSTRAINT_NAME            AS c_name,
		kcu.TABLE_NAME               AS child_table,
		kcu.COLUMN_NAME              AS child_col,
		kcu.REFERENCED_COLUMN_NAME   AS parent_col,
		kcu.POSITION_IN_UNIQUE_CONSTRAINT AS pos
		FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
		JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
		ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
		AND rc.CONSTRAINT_NAME  = kcu.CONSTRAINT_NAME
		WHERE rc.REFERENCED_TABLE_NAME = ?
		AND rc.CONSTRAINT_SCHEMA = DATABASE()
		ORDER BY rc.CONSTRAINT_NAME, kcu.POSITION_IN_UNIQUE_CONSTRAINT
	`, [this.tableName]);

	if (!rows.length) return "";

	// Agrupar por constraint
	type Group = { child_table: string; pairs: { child_col: string; parent_col: string }[] };
	const grouped = new Map<string, Group>();
	for (const r of rows) {
		const key = r.c_name as string;
		const g = grouped.get(key) ?? { child_table: r.child_table as string, pairs: [] };
		g.pairs.push({ child_col: r.child_col as string, parent_col: r.parent_col as string });
		grouped.set(key, g);
	}

	// Construir condición NOT EXISTS por cada constraint (soporta compuestas)
	const guards: string[] = [];
	for (const [, g] of grouped) {
		// opcional: validar que todas las parent_col existan en this.keyColumns si quieres exigir PK
		const conds = g.pairs
		.map(p => `d.${p.child_col} = ${parentAlias}.${p.parent_col}`)
		.join(" AND ");
		guards.push(`NOT EXISTS (SELECT 1 FROM ${g.child_table} d WHERE ${conds})`);
	}

	return guards.length ? " AND " + guards.join(" AND ") : "";
	}



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

	public async update(id: K | Partial<K>, cambios: Partial<T>): Promise<boolean> {
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

		const validIds = ids.filter((k) =>
			isPrimitiveKey(k) ? k !== undefined && k !== null : k && typeof k === "object"
		);
		if (validIds.length === 0) return 0;

		let sql = "";
		let params: any[] = [];
		const noDeps = await this.buildNoDependencyGuardsAuto("p"); // NOT EXISTS para dependencias

		if (this.keyColumns.length === 1) {
			// DELETE p FROM Tabla p WHERE p.Id IN (?, ?, ...) AND [NOT EXISTS ... AND ...]
			const col = this.keyColumns[0]!;
			const placeholders = validIds.map(() => "?").join(", ");
			sql = `DELETE p FROM ${this.tableName} p
				WHERE p.${col} IN (${placeholders})${noDeps}`;
			params = validIds as (number | string)[];
		} else {
			// DELETE p FROM Tabla p WHERE ( (p.A=? AND p.B=?) OR (...) ) AND [NOT EXISTS ...]
			const group = `(${this.keyColumns.map((c) => `p.${c} = ?`).join(" AND ")})`;
			const where = new Array(validIds.length).fill(group).join(" OR ");
			sql = `DELETE p FROM ${this.tableName} p
				WHERE (${where})${noDeps}`;

			for (const k of validIds) {
				for (const col of this.keyColumns) {
					params.push((k as Record<string, any>)[col]);
				}
			}
		}

		const [result] = await this.db.query<ResultSetHeader>(sql, params);
		return result.affectedRows;
	}


	protected buildWhereForKey(id: K | Partial<K>): { where: string; params: any[] } {
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
