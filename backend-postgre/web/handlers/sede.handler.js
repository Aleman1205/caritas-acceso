import { pool } from "../../compartido/db/pool.js";

/** Inserta una nueva sede y devuelve el registro creado */
export async function createSedeDB({ nombre, ubicacion, ciudad, horainicio, horafinal, descripcion }) {
  const query = `
    INSERT INTO sede (nombre, ubicacion, ciudad, horainicio, horafinal, descripcion)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nombre, ubicacion, ciudad, horainicio, horafinal, descripcion ?? null];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Creación devuelve un solo objeto
}

/** Obtiene sedes por nombre (case-insensitive) y devuelve siempre un array */
export async function getSedeByNombreDB(nombre) {
  const query = `
    SELECT id, nombre, ubicacion, ciudad, horainicio, horafinal, descripcion
    FROM sede
    WHERE lower(nombre) = lower($1);
  `;
  const values = [nombre];
  const { rows } = await pool.query(query, values);
  return rows; // siempre un array
}

/** Actualiza una sede por id y devuelve el registro actualizado */
export async function updateSedeDB(id, { nombre, ubicacion, ciudad, horainicio, horafinal, descripcion }) {
  const query = `
    UPDATE sede
    SET nombre=$1, ubicacion=$2, ciudad=$3, horainicio=$4, horafinal=$5, descripcion=$6
    WHERE id=$7
    RETURNING *;
  `;
  const values = [nombre, ubicacion, ciudad, horainicio, horafinal, descripcion ?? null, id];
  const { rows } = await pool.query(query, values);
  return rows[0] ? [rows[0]] : []; // siempre array
}

/** Elimina sedes por array de ids y devuelve array con ids eliminados */
export async function deleteSedesDB(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const query = `DELETE FROM sede WHERE id = ANY($1::int[]) RETURNING id;`;
  const { rows } = await pool.query(query, [ids]);
  return rows.map(r => r.id);
}

/** Obtiene todas las sedes (opcional filtro) */
export async function getAllSedesDB() {
  const query = `SELECT id, nombre, ubicacion, ciudad, horainicio, horafinal, descripcion FROM sede ORDER BY id ASC;`;
  const { rows } = await pool.query(query);
  return rows; // array
}

