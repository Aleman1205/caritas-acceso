import { pool } from "../../compartido/db/pool.js";

/**
 * Lista todos los sedeservicio con nombres de sede/servicio
 */
export async function fetchCupos() {
  const q = `
    SELECT
      ss.id,
      s.nombre  AS sede,
      sv.nombre AS servicio,
      ss.capacidad,
      ss.precio,
      TO_CHAR(ss.horainicio, 'HH24:MI:SS') AS horainicio,
      TO_CHAR(ss.horafinal,  'HH24:MI:SS') AS horafinal,
      ss.estatus
    FROM sedeservicio ss
    JOIN sede     s  ON ss.idsede = s.id
    JOIN servicio sv ON ss.idservicio = sv.id
    ORDER BY s.nombre, sv.nombre, ss.id;
  `;
  const { rows } = await pool.query(q);
  return rows;
}

/**
 * Actualiza campos permitidos en sedeservicio por id
 */
export async function updateCupoById(id, body) {
  const fields = [];
  const values = [];
  let idx = 1;

  const allow = ["capacidad", "precio", "horainicio", "horafinal", "estatus"];
  for (const k of allow) {
    if (body[k] !== undefined) {
      fields.push(`${k} = $${idx++}`);
      values.push(body[k]);
    }
  }
  if (fields.length === 0) return 0;

  const q = `UPDATE sedeservicio SET ${fields.join(", ")} WHERE id = $${idx}`;
  values.push(id);

  const result = await pool.query(q, values);
  return result.rowCount || 0;
}
