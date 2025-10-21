import { createServicioDB, getServicioByNombreDB } from "../handlers/servicio.handler.js";

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

/**
 * GET /web/servicio/:nombre
 * params: { nombre }
 * resp: { success, message, data }
 */
export async function getServicioByNombreController(req, res) {
  try {
    const { nombre } = req.params;
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'nombre' es obligatorio.",
        data: null,
      });
    }

    const servicio = await getServicioByNombreDB(nombre);

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: `No se encontró un servicio con nombre '${nombre}'.`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Servicio obtenido correctamente.",
      data: servicio,
    });
  } catch (err) {
    console.error("Error fetching servicio:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
