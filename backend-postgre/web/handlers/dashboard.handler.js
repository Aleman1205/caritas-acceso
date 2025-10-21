// web/handlers/dashboard.handler.js
import { pool } from "../../compartido/db/pool.js";

/**
 * Construye el resumen del dashboard para una fecha (YYYY-MM-DD).
 * - Totales del día (sobre tabla reserva)
 * - Capacidad por sede (suma de sedeservicio.estatus = true)
 * - Ocupación por sede = personas del día / capacidad
 */
export async function buildDashboardSummary(fechaStr) {
  // 1) Capacidad por sede (suma de sedeservicio.estatus=true)
  const capQuery = `
    SELECT s.id AS idsede, s.nombre AS sede,
           COALESCE(SUM(CASE WHEN ss.estatus = TRUE THEN ss.capacidad ELSE 0 END), 0)::int AS capacidad
    FROM sede s
    LEFT JOIN sedeservicio ss ON ss.idsede = s.id
    GROUP BY s.id, s.nombre
    ORDER BY s.id;
  `;
  const capRes = await pool.query(capQuery);
  const capacidadPorSede = capRes.rows; // [{idsede, sede, capacidad}...]

  // 2) Personas y reservas por sede en la fecha
  const peopleQuery = `
    SELECT r.idsede,
           COUNT(*)::int AS reservas,
           COALESCE(SUM(COALESCE(r.hombres,0) + COALESCE(r.mujeres,0)), 0)::int AS personas
    FROM reserva r
    WHERE DATE(r.fechainicio) = $1
    GROUP BY r.idsede
    ORDER BY r.idsede;
  `;
  const peopleRes = await pool.query(peopleQuery, [fechaStr]);
  const personasPorSede = new Map(
    peopleRes.rows.map(r => [r.idsede, { reservas: r.reservas, personas: r.personas }])
  );

  // 3) Mezclamos en un arreglo por sede
  const porSede = capacidadPorSede.map((row) => {
    const extra = personasPorSede.get(row.idsede) || { reservas: 0, personas: 0 };
    const disponibles = Math.max(0, (row.capacidad || 0) - (extra.personas || 0));
    const ocupacion = row.capacidad > 0 ? (extra.personas / row.capacidad) : 0;
    return {
      idsede: row.idsede,
      sede: row.sede,
      capacidad: row.capacidad,
      reservas: extra.reservas,
      personas: extra.personas,
      disponibles,
      ocupacion, // 0..1
    };
  });

  // 4) Totales
  const totalReservas   = porSede.reduce((a, s) => a + s.reservas, 0);
  const totalPersonas   = porSede.reduce((a, s) => a + s.personas, 0);
  const capacidadTotal  = porSede.reduce((a, s) => a + (s.capacidad || 0), 0);
  const disponibles     = porSede.reduce((a, s) => a + s.disponibles, 0);
  const sedesActivas    = porSede.filter(s => s.capacidad > 0).length;
  const ocupacionGlobal = capacidadTotal > 0 ? (totalPersonas / capacidadTotal) : 0;

  return {
    fecha: fechaStr,
    totales: {
      totalReservas,
      totalPersonas,
      capacidadTotal,
      disponibles,
      sedesActivas,
      ocupacion: ocupacionGlobal, // 0..1
    },
    porSede,
  };
}
