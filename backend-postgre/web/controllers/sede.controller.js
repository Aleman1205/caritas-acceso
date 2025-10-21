import {getSedeByNombreDB } from "../handlers/sede.handler.js";

/**
 * GET /web/sede.handler.js/nombre
 * params: { nombre }
 * resp: { success, message, data }
 */
export async function getSedeByNombreController(req, res) {
  try {
    const { nombre } = req.params;
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'nombre' es obligatorio.",
        data: null,
      });
    }

    const sede = await getSedeByNombreDB(nombre);

    if (!sede) {
      return res.status(404).json({
        success: false,
        message: `No se encontró una sede con nombre '${nombre}'.`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sede obtenida correctamente.",
      data: sede,
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
