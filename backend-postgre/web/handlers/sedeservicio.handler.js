const pool = require('../../compartido/db/pool');

// Insert new sede-servicio relation
const createSedeServicio = async ({ descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio }) => {
  const query = `
    INSERT INTO sedeservicio (descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createSedeServicio };
