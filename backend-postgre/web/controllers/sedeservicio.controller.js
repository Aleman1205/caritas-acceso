import { createSedeServicioDB } from "../handlers/sedeservicio.handler.js";

/**
 * POST /web/sedeservicio
 * body: { descripcion?, capacidad?, precio?, horainicio?, horafinal?, estatus?, idsede, idservicio }
 * resp: { success, message, data }
 */
export async function createSedeServicioController(req, res) {
  try {
    const {
      descripcion,
      capacidad,
      precio,
      horainicio,
      horafinal,
      estatus,
      idsede,
      idservicio,
    } = req.body || {};

    if (!idsede || !idservicio) {
      return res.status(400).json({
        success: false,
        message: "idsede e idservicio son obligatorios.",
        data: null,
      });
    }

    if (Number.isNaN(Number(idsede)) || Number.isNaN(Number(idservicio))) {
      return res.status(400).json({
        success: false,
        message: "idsede e idservicio deben ser enteros.",
        data: null,
      });
    }

    const relation = await createSedeServicioDB({
      descripcion,
      capacidad,
      precio,
      horainicio,
      horafinal,
      estatus,
      idsede,
      idservicio,
    });

    return res.status(201).json({
      success: true,
      message: "Relación sede-servicio creada correctamente.",
      data: relation,
    });
  } catch (err) {
    console.error("Error creating sede-servicio relation:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
