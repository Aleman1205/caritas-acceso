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
