import { fetchReservasByTelefono } from "../handlers/reservas.handler.js";
import { pool } from "../../compartido/db/pool.js";

/**
 * GET /web/reservas/:telefono
 * Respuesta estándar: { success, message, data }
 */
export async function getReservasPorTelefono(req, res) {
  const { telefono } = req.params;

  try {
    const rows = await fetchReservasByTelefono(telefono);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron reservas para este teléfono.",
        data: [],
      });
    }

    const now = new Date();
    const data = rows.map((r) => {
      let status = "pendiente";
      const ini = r.fechainicio ? new Date(r.fechainicio) : null;
      const fin = r.fechasalida ? new Date(r.fechasalida) : null;

      if (fin) status = "finalizada";
      else if (ini && ini <= now) status = "en_estancia";

      return {
        idTransaccion: r.idtransaccion,            // ⬅️ agregado (útil para el PUT)
        clave: r.idtransaccion.slice(0, 12),
        sede: r.sede,
        ubicacion: r.ubicacion,
        ciudad: r.ciudad,
        fechaInicio: r.fechainicio,
        fechaSalida: r.fechasalida,
        horaCheckIn: r.horacheckin,
        hombres: r.hombres,
        mujeres: r.mujeres,
        status,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Reservas obtenidas correctamente.",
      data,
    });
  } catch (err) {
    console.error("Error consultando reservas:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reservas",
      data: [],
    });
  }
}

/**
 * PUT /web/reservas/modificar/:tx
 * Body: { Estado: "confirmada" | "cancelada" }
 */
export async function updateReservaEstado(req, res) {
  const tx = String(req.params.tx || "").trim();
  const { Estado } = req.body || {};

  if (!tx) {
    return res
      .status(400)
      .json({ success: false, message: "IdTransaccion requerido", data: [] });
  }
  if (!["confirmada", "cancelada"].includes(Estado)) {
    return res
      .status(400)
      .json({ success: false, message: "Estado inválido", data: [] });
  }

  try {
    const q = `UPDATE reserva SET estado = $2 WHERE idtransaccion = $1`;
    const { rowCount } = await pool.query(q, [tx, Estado]);

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reserva no encontrada", data: [] });
    }

    return res.json({ success: true, message: "Estado actualizado", data: [] });
  } catch (e) {
    console.error("Error actualizando reserva:", e);
    return res
      .status(500)
      .json({ success: false, message: "Error actualizando reserva", data: [] });
  }
}
