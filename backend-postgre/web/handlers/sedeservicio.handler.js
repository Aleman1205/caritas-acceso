import { pool } from "../../compartido/db/pool.js";

/**
 * Inserta una nueva relación sede-servicio y devuelve el registro creado.
 */
export async function createSedeServicioDB({
  descripcion,
  capacidad,
  precio,
  horainicio,
  horafinal,
  estatus,
  idsede,
  idservicio,
}) {
  const query = `
    insert into sedeservicio
      (descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio)
    values ($1, $2, $3, $4, $5, coalesce($6, true), $7, $8)
    returning *;
  `;
  const values = [
    descripcion ?? null,
    capacidad ?? null,
    precio ?? null,
    horainicio ?? null,
    horafinal ?? null,
    estatus,
    Number(idsede),
    Number(idservicio),
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * Obtiene una relación sede-servicio por su ID.
 */
export async function getSedeServicioByIdDB(id) {
  const query = `
    select * from sedeservicio
    where id = $1
    limit 1;
  `;
  const values = [Number(id)];
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}
