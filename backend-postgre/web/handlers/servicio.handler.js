const pool = require('../../compartido/db/pool');

// Insert new servicio
const createServicio = async ({ nombre, descripcion, estatus }) => {
  const query = `
    INSERT INTO servicio (nombre, descripcion, estatus)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [nombre, descripcion, estatus];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createServicio };
