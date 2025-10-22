// backend-postgre/web/routes/dashboard.js
import express from "express";
import { pool } from "../../compartido/db/pool.js";

export const router = express.Router();

/**
 * GET /web/dashboard?fecha=YYYY-MM-DD
 * Si no mandas fecha => usa todas
 */
router.get("/", async (req, res) => {
  const { fecha } = req.query;

  try {
    // Filtro opcional por fechaInicio (día)
    // Ajusta columna si quieres otra (fecharegistro, etc.)
    let where = "";
    let params = [];
    if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      where = "WHERE DATE(r.fechainicio) = $1";
      params = [fecha];
    }

    // Total reservas (opcionalmente filtradas por fecha)
    const totalR = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM reserva r
      ${where}
      `,
      params
    );

    // Servicios activos (cuenta de sedeservicio estatus = true)
    const serviciosAct = await pool.query(
      `
      SELECT COUNT(*)::int AS activos
      FROM sedeservicio ss
      WHERE ss.estatus = TRUE
      `
    );

    // Sedes activas (cuenta de sedes con algo activo)
    const sedesAct = await pool.query(
      `
      SELECT COUNT(DISTINCT s.id)::int AS activas
      FROM sede s
      JOIN sedeservicio ss ON ss.idsede = s.id
      WHERE ss.estatus = TRUE
      `
    );

    // Resumen por sede: #reservas por sede (respeta filtro de fecha si aplica)
    const porSede = await pool.query(
      `
      SELECT
        s.id       AS sedeid,
        s.nombre   AS sede,
        s.ciudad   AS ciudad,
        COUNT(r.idtransaccion)::int AS reservas
      FROM sede s
      LEFT JOIN reserva r ON r.idsede = s.id
      ${where ? where.replace("WHERE", "WHERE") : ""}
      GROUP BY s.id, s.nombre, s.ciudad
      ORDER BY s.nombre ASC;
      `,
      params
    );

    return res.json({
      success: true,
      message: "Dashboard obtenido correctamente.",
      data: {
        fecha: fecha || "todas",
        totalReservas: totalR.rows?.[0]?.total ?? 0,
        serviciosActivos: serviciosAct.rows?.[0]?.activos ?? 0,
        sedesActivas: sedesAct.rows?.[0]?.activas ?? 0,
        resumenPorSede: porSede.rows ?? [],
      },
    });
  } catch (err) {
    console.error("Error /web/dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando dashboard",
      data: [],
    });
  }
});
