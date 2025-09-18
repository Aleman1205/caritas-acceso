import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { Sede, SedeDTO } from "../types/db/Sede.ts"

export default class SedeDbService {
    constructor(private db: Pool) {}
    
    public async createSede(sede: SedeDTO): Promise<boolean> {
        const [result] = await this.db.query<ResultSetHeader>(
            "INSERT INTO Sede (Ubicacion, Descripcion, HoraInicio, HoraFinal) VALUES (?, ?)",
            [sede.Ubicacion, sede.Descripcion, sede.HoraInicio, sede.HoraFinal]
        );
        return result.affectedRows > 0;
    }

    // Recordar el formato de la fecha 'HH-MM-SS'
    public async getSedes(filtros?: Partial<Sede>): Promise<Sede[]> {
        const campos = Object.keys(filtros || {});
        const valores = Object.values(filtros || {});

        let query = "SELECT * FROM Sede";
        if (campos.length > 0) {
            const whereClause = campos.map(campo => `${campo} = ?`).join(" AND ");
            query += ` WHERE ${whereClause}`;
        }

        const [rows] = await this.db.query<Sede[]>(query, valores);
        return rows;
    }

    
    public async updateSede(Id: number, cambios: Partial<Sede>): Promise<boolean> {
        const campos = Object.keys(cambios);
        const valores = Object.values(cambios);

        if (campos.length === 0) return false;

        const setClause = campos.map(campo => `${campo} = ?`).join(", ");

        const [result] = await this.db.query<ResultSetHeader>(
            `UPDATE Sede 
            SET ${setClause} 
            WHERE Id = ?`,
            [...valores, Id]
        );

        return result.affectedRows > 0;
    }

    public async deleteSede(filtros: Partial<Sede>): Promise<boolean> {
        const campos = Object.keys(filtros);
        const valores = Object.values(filtros);

        if (campos.length === 0) {
            throw new Error("Debe especificar al menos un filtro para eliminar.");
        }

        const whereClause = campos.map(campo => `${campo} = ?`).join(" AND ");
        const query = `DELETE FROM Sede WHERE ${whereClause}`;

        const [result] = await this.db.query<ResultSetHeader>(query, valores);
        return result.affectedRows > 0;
    }
}