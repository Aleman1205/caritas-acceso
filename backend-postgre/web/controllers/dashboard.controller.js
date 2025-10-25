// web/controllers/dashboard.controller.js
import { pool } from "../../compartido/db/pool.js";

/**
 * GET /web/dashboard?fecha=YYYY-MM-DD (opcional)
 * Devuelve:
 *  - totalReservas (global o del día si mandas fecha)
 *  - serviciosActivos (servicio.estatus = true)
 *  - sedesActivas (sede con algún servicio activo en sedeservicio)
 *  - resumenPorSede: reservas por sede (global o del día si mandas fecha)
 */
export async function getDashboard(req, res) {
  const rawFecha = (req.query.fecha || "").toString().trim();
  // Si viene fecha válida la usamos, si no, dejamos NULL para contar todo
  const fecha = rawFecha && /^\d{4}-\d{2}-\d{2}$/.test(rawFecha) ? rawFecha : null;

  try {
    // 1) Total de reservas (global o por fecha)
    // Nota: comparamos por DATE(fechainicio) == fecha
    const qTotalReservas = `
      SELECT COUNT(*)::int AS total
      FROM reserva r
      WHERE ($1::date IS NULL) OR (DATE(r.fechainicio) = $1::date);
    `;
    const { rows: r1 } = await pool.query(qTotalReservas, [fecha]);
    const totalReservas = r1?.[0]?.total ?? 0;

    // 2) Servicios activos (servicio.estatus = true)
    const qServiciosActivos = `
      SELECT COUNT(*)::int AS total
      FROM servicio
      WHERE estatus = true;
    `;
    const { rows: r2 } = await pool.query(qServiciosActivos);
    const serviciosActivos = r2?.[0]?.total ?? 0;

    // 3) Sedes activas: sedes que tienen algún sedeservicio.estatus = true
    // (Si prefieres contar todas las sedes, cambia a SELECT COUNT(*) FROM sede)
    const qSedesActivas = `
      SELECT COUNT(DISTINCT ss.idsede)::int AS total
      FROM sedeservicio ss
      WHERE ss.estatus = true;
    `;
    const { rows: r3 } = await pool.query(qSedesActivas);
    const sedesActivas = r3?.[0]?.total ?? 0;

    // 4) Resumen por sede (reservas por sede, global o por fecha)
    const qResumenPorSede = `
      SELECT 
        s.id AS sedeid,
        s.nombre AS sede,
        s.ciudad,
        COUNT(r.idtransaccion)::int AS reservas
      FROM sede s
      LEFT JOIN reserva r 
        ON r.idsede = s.id 
       AND ( $1::date IS NULL OR DATE(r.fechainicio) = $1::date )
      GROUP BY s.id, s.nombre, s.ciudad
      ORDER BY s.nombre;
    `;
    const { rows: r4 } = await pool.query(qResumenPorSede, [fecha]);
    const resumenPorSede = r4 ?? [];

    return res.status(200).json({
      success: true,
      message: "Dashboard obtenido correctamente.",
      data: {
        fecha: fecha || "todas",
        totalReservas,
        serviciosActivos,
        sedesActivas,
        resumenPorSede,
      },
    });
  } catch (err) {
    console.error("Error en /web/dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Error obteniendo dashboard",
      data: [],
    });
  }
}
