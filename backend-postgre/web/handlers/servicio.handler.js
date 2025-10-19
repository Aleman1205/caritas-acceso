import { pool } from "../../compartido/db/pool.js";

/**
 * Inserta un servicio y devuelve el registro creado.
 */
export async function createServicioDB({ nombre, descripcion, estatus }) {
  const query = `
    insert into servicio (nombre, descripcion, estatus)
    values ($1, $2, coalesce($3, true))
    returning *;
  `;
  const values = [nombre, descripcion, estatus];
  const { rows } = await pool.query(query, values);
  return rows[0];
}
