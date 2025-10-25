// backend-postgre/web/controllers/reservas.controller.js
import {
  fetchReservasByTelefono,
  fetchReservasAll,
  // 👇 nuevo import para borrar
  deleteReservaByIdTx,
} from "../handlers/reservas.handler.js";

/** Mapea filas crudas -> shape usado por el front */
function mapRows(rows) {
  const now = new Date();
  return rows.map((r) => {
    let status = "pendiente";
    const ini = r.fechainicio ? new Date(r.fechainicio) : null;
    const fin = r.fechasalida ? new Date(r.fechasalida) : null;
    if (fin) status = "finalizada";
    else if (ini && ini <= now) status = "en_estancia";

    return {
      idTransaccion: r.idtransaccion,                 // completo
      clave: r.idtransaccion?.slice(0, 12) ?? "",     // recortado
      sede: r.sede,
      ubicacion: r.ubicacion,
      ciudad: r.ciudad,
      fechaInicio: r.fechainicio,
      fechaSalida: r.fechasalida,
      horaCheckIn: r.horacheckin,
      hombres: r.hombres,
      mujeres: r.mujeres,
      status,
      telefono: r.telefono ?? null,
    };
  });
}

/** GET /web/reservas/:telefono  (búsqueda por teléfono) */
export async function getReservasPorTelefono(req, res) {
  const raw = req.params.telefono ?? "";
  const telefono = String(raw).trim();

  try {
    const rows = await fetchReservasByTelefono(telefono);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron reservas para este teléfono.",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Reservas obtenidas correctamente.",
      data: mapRows(rows),
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

/** GET /web/reservas  (todas) */
export async function getReservasTodas(_req, res) {
  try {
    const rows = await fetchReservasAll();
    return res.status(200).json({
      success: true,
      message: "Reservas (todas) obtenidas correctamente.",
      data: mapRows(rows),
    });
  } catch (err) {
    console.error("Error consultando reservas (todas):", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reservas",
      data: [],
    });
  }
}

/* ==================== NUEVO: DELETE /web/reservas/:id ==================== */
/** Elimina una reserva de la tabla `reserva` por IdTransaccion. */
export async function deleteReservaWeb(req, res) {
  try {
    const id = String(req.params.id ?? "").trim();
    if (!id) {
      return res.status(400).json({ success: false, message: "Falta id", data: [] });
    }

    const ok = await deleteReservaByIdTx(id);
    if (!ok) {
      return res
        .status(404)
        .json({ success: false, message: "Reserva no encontrada", data: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: "Reserva eliminada.", data: [] });
  } catch (err) {
    console.error("Error eliminando reserva:", err);
    return res
      .status(500)
      .json({ success: false, message: "No se pudo eliminar la reserva", data: [] });
  }
}
