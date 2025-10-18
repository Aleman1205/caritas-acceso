import type { ResultSetHeader, RowDataPacket, Pool } from "mysql2/promise";
import BaseDbService from "./base.js";
import type { Ruta } from "../types/db/Ruta.js";

const ALLOWED_FIELDS = ["IdSedeServicio", "Orden", "Hora", "IdParada"] as const;
const ALLOWED_UPDATE_FIELDS = ["IdParada", "Hora"] as const;

export default class RutaDbService extends BaseDbService<Ruta, { IdSedeServicio: number, Orden: number }> {
  constructor(db: Pool) {
    super(db, "Ruta", ALLOWED_FIELDS, ALLOWED_UPDATE_FIELDS, ["IdSedeServicio", "Orden"]);
  }

  // Crear una sola parada
  public override async create(objeto: Ruta): Promise<boolean> {
    const sql = `
      INSERT INTO ${this.tableName} (IdSedeServicio, Orden, Hora, IdParada)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await this.db.query<ResultSetHeader>(sql, [
      objeto.IdSedeServicio,
      objeto.Orden,
      objeto.Hora,
      objeto.IdParada,
    ]);
    return result.affectedRows > 0;
  }

  // Crear varias paradas de golpe
  public async createMany(idSedeServicio: number, rutas: Ruta[]): Promise<boolean> {
    if (rutas.length === 0) return false;

    const values = rutas.map(() => "(?, ?, ?, ?)").join(", ");
    const params = rutas.flatMap((r) => [idSedeServicio, r.Orden, r.Hora, r.IdParada]);

    const sql = `
      INSERT INTO ${this.tableName} (IdSedeServicio, Orden, Hora, IdParada)
      VALUES ${values}
    `;
    const [result] = await this.db.query<ResultSetHeader>(sql, params);
    return result.affectedRows > 0;
  }

  // Reemplazar la ruta completa (borrar todo y volver a insertar)
  public async replaceRuta(idSedeServicio: number, nuevasParadas: Omit<Ruta, "IdSedeServicio">[]): Promise<boolean> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(`DELETE FROM ${this.tableName} WHERE IdSedeServicio = ?`, [idSedeServicio]);

      if (nuevasParadas.length > 0) {
        const values = nuevasParadas.map(() => "(?, ?, ?, ?)").join(", ");
        const params = nuevasParadas.flatMap((p) => [idSedeServicio, p.Orden, p.Hora, p.IdParada]);

        const sql = `
          INSERT INTO ${this.tableName} (IdSedeServicio, Orden, Hora, IdParada)
          VALUES ${values}
        `;
        await conn.query<ResultSetHeader>(sql, params);
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Sincronizar ruta (update/insert/delete según diferencias)
  public async syncRuta(idSedeServicio: number, nuevasParadas: Omit<Ruta, "IdSedeServicio">[]): Promise<boolean> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query<RowDataPacket[]>(
        `SELECT * FROM ${this.tableName} WHERE IdSedeServicio = ?`,
        [idSedeServicio]
      );
      const actuales = rows as Ruta[];

      const ordenesNuevos = nuevasParadas.map((p) => p.Orden);
      const ordenesActuales = actuales.map((p) => p.Orden);

      // Eliminar las que ya no existen
      const eliminadas = actuales.filter((p) => !ordenesNuevos.includes(p.Orden));
      for (const e of eliminadas) {
        await conn.query(
          `DELETE FROM ${this.tableName} WHERE IdSedeServicio = ? AND Orden = ?`,
          [idSedeServicio, e.Orden]
        );
      }

      // Insertar o actualizar
      for (const nueva of nuevasParadas) {
        const existe = actuales.find((p) => p.Orden === nueva.Orden);

        if (!existe) {
          // Insertar nueva
          await conn.query(
            `INSERT INTO ${this.tableName} (IdSedeServicio, Orden, Hora, IdParada)
             VALUES (?, ?, ?, ?)`,
            [idSedeServicio, nueva.Orden, nueva.Hora, nueva.IdParada]
          );
        } else {
          // Actualizar si cambió algo
          if (existe.Hora !== nueva.Hora || existe.IdParada !== nueva.IdParada) {
            await conn.query(
              `UPDATE ${this.tableName}
               SET Hora = ?, IdParada = ?
               WHERE IdSedeServicio = ? AND Orden = ?`,
              [nueva.Hora, nueva.IdParada, idSedeServicio, nueva.Orden]
            );
          }
        }
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}