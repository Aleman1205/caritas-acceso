import { createParadaDB, getParadaByNombreDB } from "../handlers/parada.handler.js";

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

/** GET /web/parada/:nombre
 * params: { nombre }
 * respuesta: { success, message, data }
 */
export async function getParadaByNombreController(req, res) {
  try {
    const { nombre } = req.params;
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'nombre' es obligatorio.",
        data: null,
      });
    }

    const parada = await getParadaByNombreDB(nombre);

    if (!parada) {
      return res.status(404).json({
        success: false,
        message: `No se encontró una parada con nombre '${nombre}'.`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parada obtenida correctamente.",
      data: parada,
    });
  } catch (err) {
    console.error("Error fetching parada:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
