import { createServicioDB, getServicioByNombreDB } from "../handlers/servicio.handler.js";

/**
 * POST /web/servicio
 */
export async function createServicioController(req, res) {
  try {
    const { nombre, descripcion, estatus } = req.body || {};

    if (!nombre || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "nombre y descripcion son obligatorios.",
        data: [],
      });
    }

    const servicios = await createServicioDB({ nombre, descripcion, estatus });

    return res.status(201).json({
      success: true,
      message: "Servicio creado correctamente.",
      data: servicios, // <-- array
    });
  } catch (err) {
    console.error("Error creating servicio:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: [],
    });
  }
}

/**
 * GET /web/servicio/:nombre
 */
export async function getServicioByNombreController(req, res) {
  try {
    const { nombre } = req.params;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'nombre' es obligatorio.",
        data: [],
      });
    }

    const servicios = await getServicioByNombreDB(nombre);

    return res.status(200).json({
      success: true,
      message: servicios.length
        ? "Servicios obtenidos correctamente."
        : `No se encontraron servicios con nombre '${nombre}'.`,
      data: servicios, // <-- siempre array
    });
  } catch (err) {
    console.error("Error fetching servicio:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: [],
    });
  }
}
