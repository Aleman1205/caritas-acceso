import { fetchReservasByTelefono } from "../handlers/reservas.handler.js";

/**
 * GET /web/reservas/:telefono
 * Respuesta estándar: { success, message, data }
 */
export async function getReservasPorTelefono(req, res) {
  const { telefono } = req.params;

  try {
    const rows = await fetchReservasByTelefono(telefono);

    if (rows.length === 0) {
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
