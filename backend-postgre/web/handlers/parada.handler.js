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
export async function getParadaByNombreDB(nombre) {
  const query = `
    select * from parada
    where lower(nombre) = lower($1)
    limit 1;
  `;
  const values = [nombre];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}
