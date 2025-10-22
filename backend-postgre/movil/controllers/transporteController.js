import { pool } from "../../compartido/db/pool.js";

/**
 * Controlador que devuelve los datos del transporte (sede y teléfono)
 * asociados a la última reserva activa o futura de un beneficiario.
 */
export async function obtenerDatosTransporte(req, res) {
  try {
    let { telefono } = req.query;

    // 🧩 Validar parámetro
    if (!telefono) {
      return res.status(400).json({
        success: false,
        message: "Falta el parámetro 'telefono'",
      });
    }

    // 🧹 Normalizar formato del teléfono (quita espacios y asegura prefijo +52)
    telefono = telefono.replace(/\s+/g, ""); // elimina espacios
    if (!telefono.startsWith("+52")) {
      if (telefono.startsWith("52")) telefono = "+" + telefono;
      else if (!telefono.startsWith("+")) telefono = "+52" + telefono;
    }

    // 🔍 Query: incluye reservas activas o futuras
    const query = `
      SELECT 
        s.nombre AS sede,
        b.telefono,
        b.nombre AS beneficiario
      FROM reserva r
      JOIN beneficiario b ON b.id = r.idbeneficiario
      JOIN sede s ON s.id = r.idsede
      WHERE REPLACE(b.telefono, ' ', '') = $1
      AND (
        r.fechasalida IS NULL 
        OR r.fechasalida > NOW()
        OR r.fechainicio > NOW()   -- ✅ incluye reservas futuras
      )
      ORDER BY r.fechainicio DESC
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [telefono]);

    // 🚫 Sin resultados
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró una reserva activa para este teléfono",
      });
    }

    // ✅ Respuesta correcta
    res.status(200).json({
      success: true,
      message: "Datos de transporte obtenidos correctamente",
      data: rows[0],
    });

  } catch (error) {
    console.error("Error al obtener datos de transporte:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener datos de transporte",
      error: error.message,
    });
  }
}
