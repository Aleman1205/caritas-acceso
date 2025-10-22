import { pool } from "../../compartido/db/pool.js";

export async function solicitarTransporte(req, res) {
  try {
    console.log("📩 Incoming transporte request:", req.body);

    const { telefono, direccion, descripcion } = req.body;

    if (!telefono || !direccion) {
      console.log("⚠️ Missing required data:", { telefono, direccion });
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos",
      });
    }

    // 🔍 Buscar reserva activa (sin normalizar)
    const queryReserva = `
      SELECT r.idsede, b.nombre
      FROM reserva r
      JOIN beneficiario b ON b.id = r.idbeneficiario
      WHERE REPLACE(b.telefono, ' ', '') = $1
      AND (r.fechasalida IS NULL OR r.fechasalida > NOW())
      ORDER BY r.fechainicio DESC
      LIMIT 1;
    `;
    console.log("🔍 Ejecutando consulta de reserva...");
    const reservaResult = await pool.query(queryReserva, [telefono]);
    const rows = reservaResult.rows;
    console.log("🔍 Resultado de reserva:", rows);

    if (rows.length === 0) {
      console.log("❌ No se encontró reserva activa para este teléfono.");
      return res.status(404).json({
        success: false,
        message: "No se encontró una reserva activa para este teléfono",
      });
    }

    const { idsede, nombre } = rows[0];
    console.log("✅ Reserva activa encontrada:", { idsede, nombre });

    // 🔹 Insertar solicitud de transporte en Parada
    const queryInsert = `
      INSERT INTO parada (nombre, descripcion, ubicacion, estatus, idsede)
      VALUES ($1, $2, $3, true, $4)
      RETURNING *;
    `;
    console.log("📝 Insertando nueva Parada...");
    const insertResult = await pool.query(queryInsert, [
      `Solicitud de ${nombre}`,
      descripcion || "Sin descripción",
      direccion,
      idsede,
    ]);
    console.log("✅ Parada insertada correctamente:", insertResult.rows[0]);

    res.status(201).json({
      success: true,
      message: "Solicitud de transporte registrada correctamente",
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al registrar transporte:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar transporte",
      error: error.message,
    });
  }
}
