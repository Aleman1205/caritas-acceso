import { createServicioDB } from "../handlers/servicio.handler.js";

/**
 * POST /web/servicio
 * body: { nombre, descripcion, estatus? }
 * resp: { success, message, data }
 */
export async function createServicioController(req, res) {
  try {
    const { nombre, descripcion, estatus } = req.body || {};

    if (!nombre || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "nombre y descripcion son obligatorios.",
        data: null,
      });
    }

    const servicio = await createServicioDB({ nombre, descripcion, estatus });

    return res.status(201).json({
      success: true,
      message: "Servicio creado correctamente.",
      data: servicio,
    });
  } catch (err) {
    console.error("Error creating servicio:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
