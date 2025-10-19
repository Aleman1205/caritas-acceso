const pool = require('../../compartido/db/pool');

// Insert new parada
const createParada = async ({ nombre, descripcion, ubicacion, estatus, idsede }) => {
  const query = `
    INSERT INTO parada (nombre, descripcion, ubicacion, estatus, idsede)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [nombre, descripcion, ubicacion, estatus, idsede];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { createParada };
