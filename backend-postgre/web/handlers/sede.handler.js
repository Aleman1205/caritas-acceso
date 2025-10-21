/*getSedeByNombreDB */ 

import { pool } from "../../compartido/db/pool.js";

/*
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
  */

export async function getSedeByNombreDB(nombre) {
  const query = `
    SELECT id, nombre, ubicacion, ciudad, horainicio, horafinal, descripcion
    FROM sede
    WHERE nombre = $1;
  `;
  const values = [nombre];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Retorna solo el primer resultado (debería ser único)
}
