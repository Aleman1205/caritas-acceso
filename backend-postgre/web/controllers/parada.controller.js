import { pool } from "../../compartido/db/pool.js";

/* ===================== LISTAR ===================== */

// GET /web/parada
export async function getParadasCtrl(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT id, nombre, descripcion, ubicacion, estatus, idsede
      FROM parada
      ORDER BY id ASC;
    `);

    return res.json({ success: true, message: "Paradas obtenidas", data: rows ?? [] });
  } catch (err) {
    console.error("Error getParadasCtrl:", err);
    return res.status(500).json({ success: false, message: "Error al obtener paradas", data: [] });
  }
}

// GET /web/parada/sede/:id
export async function getParadasBySedeCtrl(req, res) {
  try {
    const idSede = Number(req.params.id);
    if (!idSede) return res.status(400).json({ success: false, message: "idsede inválido", data: [] });

    const { rows } = await pool.query(
      `SELECT id, nombre, descripcion, ubicacion, estatus, idsede
       FROM parada WHERE idsede = $1 ORDER BY id ASC;`,
      [idSede]
    );

    return res.json({ success: true, message: "Paradas por sede obtenidas", data: rows ?? [] });
  } catch (err) {
    console.error("Error getParadasBySedeCtrl:", err);
    return res.status(500).json({ success: false, message: "Error al obtener paradas por sede", data: [] });
  }
}

/* ===================== CREAR ===================== */

// POST /web/parada
export async function createParadaCtrl(req, res) {
  try {
    const { nombre, descripcion = null, ubicacion = null, estatus = true, idsede } = req.body ?? {};
    if (!nombre || !idsede)
      return res.status(400).json({ success: false, message: "nombre e idsede son requeridos", data: [] });

    const { rows } = await pool.query(
      `INSERT INTO parada (nombre, descripcion, ubicacion, estatus, idsede)
       VALUES ($1,$2,$3,$4,$5) RETURNING id;`,
      [nombre, descripcion, ubicacion, estatus, idsede]
    );

    return res.json({ success: true, message: "Parada creada", data: rows?.[0] ?? {} });
  } catch (err) {
    console.error("Error createParadaCtrl:", err);
    return res.status(500).json({ success: false, message: "Error al crear parada", data: [] });
  }
}

/* ===================== ACTUALIZAR ===================== */

// PUT /web/parada/:id
export async function updateParadaCtrl(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Id inválido", data: [] });

    const { nombre, descripcion, ubicacion, estatus, idsede } = req.body ?? {};

    const { rowCount } = await pool.query(
      `UPDATE parada SET
         nombre      = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         ubicacion   = COALESCE($3, ubicacion),
         estatus     = COALESCE($4, estatus),
         idsede      = COALESCE($5, idsede)
       WHERE id = $6;`,
      [nombre, descripcion, ubicacion, estatus, idsede, id]
    );

    return res.json({ success: true, message: rowCount ? "Parada actualizada" : "Nada que actualizar", data: [] });
  } catch (err) {
    console.error("Error updateParadaCtrl:", err);
    return res.status(500).json({ success: false, message: "Error al actualizar parada", data: [] });
  }
}

/* ===================== ELIMINAR ===================== */

// DELETE /web/parada/:id
export async function deleteParadaCtrl(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Id inválido", data: [] });

    const { rowCount } = await pool.query(`DELETE FROM parada WHERE id = $1;`, [id]);

    return res.json({ success: true, message: rowCount ? "Parada eliminada" : "Parada no encontrada", data: [] });
  } catch (err) {
    console.error("Error deleteParadaCtrl:", err);
    return res.status(500).json({ success: false, message: "Error al eliminar parada", data: [] });
  }
}
