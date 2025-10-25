import { pool } from "../../compartido/db/pool.js";

/* ======================== SEDES ======================== */
export async function getSedesCtrl(_req, res) {
  try {
    // Tabla real: sede (no existen 'telefono' ni 'estatus')
    // Mapeamos 'ubicacion' -> 'direccion' para que el front no cambie,
    // y devolvemos placeholders para telefono/estatus.
    const { rows } = await pool.query(`
      SELECT
        id,
        nombre,
        ubicacion AS direccion,
        ciudad,
        horainicio,
        horafinal,
        descripcion,
        NULL::text AS telefono,
        TRUE AS estatus
      FROM sede
      ORDER BY nombre ASC;
    `);

    return res.json({
      success: true,
      message: "Sedes obtenidas",
      data: rows ?? [],
    });
  } catch (err) {
    console.error("Error getSedesCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al obtener sedes",
      data: [],
    });
  }
}

/* ====================== SERVICIOS ====================== */
export async function getServiciosCtrl(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT id, nombre, descripcion, estatus
      FROM servicio
      ORDER BY nombre ASC;
    `);

    return res.json({
      success: true,
      message: "Servicios obtenidos",
      data: rows ?? [],
    });
  } catch (err) {
    console.error("Error getServiciosCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al obtener servicios",
      data: [],
    });
  }
}

/* ==================== ASIGNACIONES ===================== */
/* Tabla de asignaciones: sedeservicio (ojo: sin guion bajo) */
export async function getAsignacionesCtrl(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT
        ss.id,
        ss.idsede,
        s.nombre      AS sede,
        ss.idservicio,
        sv.nombre     AS servicio,
        ss.descripcion,
        ss.capacidad,
        ss.precio,
        ss.horainicio,
        ss.horafinal,
        ss.estatus
      FROM sedeservicio ss
      JOIN sede     s  ON s.id  = ss.idsede
      JOIN servicio sv ON sv.id = ss.idservicio
      ORDER BY s.nombre ASC, sv.nombre ASC;
    `);

    return res.json({
      success: true,
      message: "Asignaciones obtenidas",
      data: rows ?? [],
    });
  } catch (err) {
    console.error("Error getAsignacionesCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al obtener asignaciones",
      data: [],
    });
  }
}

export async function createAsignacionCtrl(req, res) {
  try {
    const {
      idsede,
      idservicio,
      descripcion = null,
      capacidad = null,
      precio = null,
      horainicio = null,
      horafinal = null,
      estatus = true,
    } = req.body ?? {};

    if (!idsede || !idservicio) {
      return res.status(400).json({
        success: false,
        message: "idsede e idservicio son requeridos",
        data: [],
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO sedeservicio
        (idsede, idservicio, descripcion, capacidad, precio, horainicio, horafinal, estatus)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id;
      `,
      [idsede, idservicio, descripcion, capacidad, precio, horainicio, horafinal, estatus]
    );

    return res.json({
      success: true,
      message: "Asignación creada",
      data: rows[0] ?? {},
    });
  } catch (err) {
    console.error("Error createAsignacionCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al crear asignación",
      data: [],
    });
  }
}

export async function updateAsignacionCtrl(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Id inválido", data: [] });
    }

    const {
      idsede,
      idservicio,
      descripcion = null,
      capacidad = null,
      precio = null,
      horainicio = null,
      horafinal = null,
      estatus = null,
    } = req.body ?? {};

    const { rowCount } = await pool.query(
      `
      UPDATE sedeservicio
      SET
        idsede      = COALESCE($1, idsede),
        idservicio  = COALESCE($2, idservicio),
        descripcion = COALESCE($3, descripcion),
        capacidad   = COALESCE($4, capacidad),
        precio      = COALESCE($5, precio),
        horainicio  = COALESCE($6, horainicio),
        horafinal   = COALESCE($7, horafinal),
        estatus     = COALESCE($8, estatus)
      WHERE id = $9;
      `,
      [idsede, idservicio, descripcion, capacidad, precio, horainicio, horafinal, estatus, id]
    );

    return res.json({
      success: true,
      message: rowCount ? "Asignación actualizada" : "Nada que actualizar",
      data: [],
    });
  } catch (err) {
    console.error("Error updateAsignacionCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar asignación",
      data: [],
    });
  }
}

export async function deleteAsignacionCtrl(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Id inválido", data: [] });
    }
    const { rowCount } = await pool.query(`DELETE FROM sedeservicio WHERE id = $1;`, [id]);

    return res.json({
      success: true,
      message: rowCount ? "Asignación eliminada" : "Asignación no encontrada",
      data: [],
    });
  } catch (err) {
    console.error("Error deleteAsignacionCtrl:", err);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar asignación",
      data: [],
    });
  }
}
