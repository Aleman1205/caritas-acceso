import { fetchCupos, updateCupoById } from "../handlers/cupos.handler.js";

/**
 * GET /web/cupos
 * Lista cupos/horarios por sede-servicio (join con sede y servicio)
 */
export async function getCupos(req, res) {
  try {
    const rows = await fetchCupos();
    return res.status(200).json({
      success: true,
      message: "Cupos obtenidos correctamente.",
      data: rows,
    });
  } catch (err) {
    console.error("Error obteniendo cupos:", err);
    return res.status(500).json({
      success: false,
      message: "Error obteniendo cupos",
      data: [],
    });
  }
}

/**
 * PUT /web/cupos/:id
 * Body permitido: { capacidad?, precio?, horainicio?, horafinal?, estatus? }
 */
export async function updateCupo(req, res) {
  const { id } = req.params;
  const { capacidad, precio, horainicio, horafinal, estatus } = req.body || {};

  // Validaciones básicas (opcionales)
  if (capacidad !== undefined && Number.isNaN(Number(capacidad))) {
    return res.status(400).json({ success: false, message: "capacidad inválida", data: [] });
  }
  if (precio !== undefined && Number.isNaN(Number(precio))) {
    return res.status(400).json({ success: false, message: "precio inválido", data: [] });
  }
  if (estatus !== undefined && typeof estatus !== "boolean") {
    return res.status(400).json({ success: false, message: "estatus debe ser boolean", data: [] });
  }

  try {
    const count = await updateCupoById(id, { capacidad, precio, horainicio, horafinal, estatus });
    if (count === 0) {
      return res.status(404).json({ success: false, message: "No existe el cupo", data: [] });
    }
    return res.status(200).json({ success: true, message: "Cupo actualizado", data: [] });
  } catch (err) {
    console.error("Error actualizando cupo:", err);
    return res.status(500).json({
      success: false,
      message: "Error actualizando cupo",
      data: [],
    });
  }
}
