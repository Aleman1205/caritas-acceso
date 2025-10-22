import { pool } from "../../compartido/db/pool.js";

/** Crea un servicio y devuelve el registro creado (objeto). */
export async function createServicioDB({ nombre, descripcion, estatus }) {
  const q = `
    INSERT INTO servicio (nombre, descripcion, estatus)
    VALUES ($1, $2, COALESCE($3, true))
    RETURNING id, nombre, descripcion, estatus;
  `;
  const v = [nombre, descripcion ?? null, estatus];
  const { rows } = await pool.query(q, v);
  return rows[0];
}

/** Lista todos los servicios (array). */
export async function listServiciosDB() {
  const q = `
    SELECT id, nombre, descripcion, estatus
    FROM servicio
    ORDER BY id DESC;
  `;
  const { rows } = await pool.query(q);
  return rows;
}

/** Busca servicios por nombre (array). Búsqueda parcial, case-insensitive. */
export async function findServiciosByNombreDB(nombre) {
  const q = `
    SELECT id, nombre, descripcion, estatus
    FROM servicio
    WHERE lower(nombre) LIKE lower($1)
    ORDER BY id DESC;
  `;
  const v = [`%${nombre}%`];
  const { rows } = await pool.query(q, v);
  return rows;
}

/** Obtiene un servicio por id (objeto o null). */
export async function getServicioByIdDB(id) {
  const { rows } = await pool.query(
    `SELECT id, nombre, descripcion, estatus FROM servicio WHERE id = $1;`,
    [id]
  );
  return rows[0] ?? null;
}

/** Actualiza parcialmente un servicio y devuelve el actualizado (objeto o null). */
export async function updateServicioDB(id, { nombre, descripcion, estatus }) {
  const q = `
    UPDATE servicio
    SET
      nombre = COALESCE($2, nombre),
      descripcion = COALESCE($3, descripcion),
      estatus = COALESCE($4, estatus)
    WHERE id = $1
    RETURNING id, nombre, descripcion, estatus;
  `;
  const v = [id, nombre ?? null, descripcion ?? null, estatus];
  const { rows } = await pool.query(q, v);
  return rows[0] ?? null;
}

/** Elimina un servicio por id. Devuelve boolean. */
export async function deleteServicioDB(id) {
  const { rowCount } = await pool.query(`DELETE FROM servicio WHERE id = $1;`, [id]);
  return rowCount > 0;
}
