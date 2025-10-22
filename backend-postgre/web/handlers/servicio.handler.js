import { pool } from "../../compartido/db/pool.js";

/**
 * Inserta un servicio y devuelve el registro creado como array
 */
export async function createServicioDB({ nombre, descripcion, estatus }) {
  const query = `
    INSERT INTO servicio (nombre, descripcion, estatus)
    VALUES ($1, $2, COALESCE($3, true))
    RETURNING *;
  `;
  const values = [nombre, descripcion, estatus];
  const { rows } = await pool.query(query, values);
  return rows; // <-- ahora devuelve array
}

/**
 * Obtiene servicios por nombre y devuelve un array
 */
export async function getServicioByNombreDB(nombre) {
  const query = `
    SELECT id, nombre, descripcion, estatus
    FROM servicio
    WHERE nombre ILIKE $1;  -- permite coincidencias parciales
  `;
  const values = [`%${nombre}%`];
  const { rows } = await pool.query(query, values);
  return rows; // <-- siempre array (puede estar vacío)
}
