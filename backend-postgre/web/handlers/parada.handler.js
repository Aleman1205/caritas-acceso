import { pool } from "../../compartido/db/pool.js";

/** Inserta una nueva parada y devuelve el registro creado */
export async function createParadaDB({ nombre, descripcion, ubicacion, estatus, idsede }) {
  const query = `
    insert into parada (nombre, descripcion, ubicacion, estatus, idsede)
    values ($1, $2, $3, coalesce($4, true), $5)
    returning *;
  `;
  const values = [nombre, descripcion ?? null, ubicacion, estatus, idsede];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

/** Obtiene una parada por su nombre */
/** Obtiene paradas por nombre (puede devolver múltiples coincidencias) */
export async function getParadaByNombreDB(nombre) {
  const query = `
    select * from parada
    where lower(nombre) like lower($1);
  `;
  const values = [`%${nombre}%`]; // permite coincidencias parciales
  const { rows } = await pool.query(query, values);
  return rows; // <-- DEVOLVEMOS UN ARRAY, aunque sea vacío
}

