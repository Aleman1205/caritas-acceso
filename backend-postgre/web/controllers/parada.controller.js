import { createParadaDB } from "../handlers/parada.handler.js";

/** POST /web/parada
 * body: { nombre, descripcion?, ubicacion, estatus?, idsede }
 * respuesta: { success, message, data }
 */
export async function createParadaController(req, res) {
  try {
    const { nombre, descripcion, ubicacion, estatus, idsede } = req.body || {};
    if (!nombre || !ubicacion || !idsede) {
      return res.status(400).json({
        success: false,
        message: "nombre, ubicacion e idsede son obligatorios.",
        data: null,
      });
    }

    const creada = await createParadaDB({ nombre, descripcion, ubicacion, estatus, idsede });

    return res.status(201).json({
      success: true,
      message: "Parada creada correctamente.",
      data: creada,
    });
  } catch (err) {
    console.error("Error creating parada:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
