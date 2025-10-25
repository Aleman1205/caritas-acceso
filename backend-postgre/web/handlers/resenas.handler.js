// backend-postgre/web/handlers/resenas.handler.js
import { pool } from "../../compartido/db/pool.js";

/**
 * Lee reseñas desde la tabla `rating`.
 * Puedes pasar { idSede } para filtrar por sede.
 */
export async function fetchResenas({ idSede } = {}) {
  const params = [];
  let where = "";

  if (idSede !== undefined && idSede !== null && String(idSede).trim() !== "") {
    params.push(idSede);
    where = `WHERE r.id_sede = $${params.length}`;
  }

  const query = `
    SELECT
      r.id,
      r.int_estrellas,
      r.comentarios,
      r.id_sede,
      r.created_at,
      r.updated_at
    FROM rating r
    ${where}
    ORDER BY r.created_at DESC NULLS LAST;
  `;

  const { rows } = await pool.query(query, params);
  return rows;
}
