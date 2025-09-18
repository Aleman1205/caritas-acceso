import type { Pool } from "mysql2/promise";
import type Sede from "../types/db/Sede.ts"

export default class SedeDbService {
    constructor(private db: Pool) {}
    
    public async crearSede(sede: Sede): Promise<void> {
        await this.db.query(
            "INSERT INTO Sede (Ubicacion, Descripcion, HoraInicio, HoraFinal) VALUES (?, ?)",
            [sede.Ubicacion, sede.Descripcion, sede.HoraInicio, sede.HoraFinal]
        );
    }

    public async getSedes(): Promise<Sede[]> {
        const [rows] = await this.db.query<Sede[]>(
            "SELECT * FROM Sede"
        );
        return rows;
    }
    
    // Recordar que HoraInicio y HoraFinal usan TIME 'HH:MM:SS'
    public async getSedesPorHorario(HoraInicio: string, HoraFinal: string): Promise<Sede[]> {
        const [rows] = await this.db.query<Sede[]>(
            "SELECT * FROM Sede WHERE HoraInicio = ? AND HoraFinal ?",
            [HoraInicio, HoraFinal]
        );
        return rows;
    }

    public async getSedePorId(Id: number): Promise<Sede | null> {
        const [rows] = await this.db.query<Sede[]>(
            "SELECT * FROM Sede WHERE Id = ?",
            [Id]
        );
        return rows[0] ?? null;
    }
}