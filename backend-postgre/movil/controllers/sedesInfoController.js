import { pool } from "../../compartido/db/pool.js";

/**
 * Controlador que devuelve todas las sedes junto con sus servicios
 * para la pantalla principal del app móvil.
 */
export async function obtenerSedesConServicios(req, res) {
  try {
    const query = `
      SELECT 
        s.id,
        s.nombre,
        s.ubicacion,
        s.ciudad,
        s.horainicio,
        s.horafinal,
        s.descripcion,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', sv.id,
              'nombre', sv.nombre,
              'descripcion', sv.descripcion
            )
          ) FILTER (WHERE sv.id IS NOT NULL),
          '[]'
        ) AS servicios
      FROM sede s
      LEFT JOIN sedeservicio ss ON ss.idsede = s.id
      LEFT JOIN servicio sv ON sv.id = ss.idservicio
      GROUP BY s.id, s.nombre, s.ubicacion, s.ciudad, s.horainicio, s.horafinal, s.descripcion
      ORDER BY s.id;
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      message: "Sedes y servicios obtenidos correctamente",
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener sedes y servicios",
      error: error.message,
    });
  }
}