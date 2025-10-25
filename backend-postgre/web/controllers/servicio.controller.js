// Controladores con shape { success, message, data }
import {
  createServicioDB,
  listServiciosDB,
  findServiciosByNombreDB,
  getServicioByIdDB,
  updateServicioDB,
  deleteServicioDB,
} from "../handlers/servicio.handler.js";

export async function createServicioController(req, res) {
  try {
    const { nombre, descripcion, estatus } = req.body || {};
    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({
        success: false,
        message: "El campo 'nombre' es requerido.",
        data: [],
      });
    }
    const row = await createServicioDB({ nombre, descripcion, estatus });
    return res.json({ success: true, message: "Servicio creado.", data: row });
  } catch (err) {
    console.error("createServicioController:", err);
    return res.status(500).json({ success: false, message: "Error creando servicio.", data: [] });
  }
}

export async function listServiciosController(_req, res) {
  try {
    const rows = await listServiciosDB();
    return res.json({ success: true, message: "Servicios listados.", data: rows });
  } catch (err) {
    console.error("listServiciosController:", err);
    return res.status(500).json({ success: false, message: "Error listando servicios.", data: [] });
  }
}

export async function findServiciosByNombreController(req, res) {
  try {
    // usamos query ?q= para evitar choques con otras rutas
    const q = String(req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Parámetro 'q' requerido.",
        data: [],
      });
    }
    const rows = await findServiciosByNombreDB(q);
    return res.json({ success: true, message: "Búsqueda completada.", data: rows });
  } catch (err) {
    console.error("findServiciosByNombreController:", err);
    return res.status(500).json({ success: false, message: "Error buscando servicios.", data: [] });
  }
}

export async function getServicioByIdController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Id inválido.", data: [] });
    }
    const row = await getServicioByIdDB(id);
    if (!row) {
      return res.status(404).json({ success: false, message: "No encontrado.", data: [] });
    }
    return res.json({ success: true, message: "Servicio obtenido.", data: row });
  } catch (err) {
    console.error("getServicioByIdController:", err);
    return res.status(500).json({ success: false, message: "Error consultando servicio.", data: [] });
  }
}

export async function updateServicioController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Id inválido.", data: [] });
    }
    const row = await updateServicioDB(id, req.body || {});
    if (!row) {
      return res.status(404).json({ success: false, message: "No encontrado.", data: [] });
    }
    return res.json({ success: true, message: "Servicio actualizado.", data: row });
  } catch (err) {
    console.error("updateServicioController:", err);
    return res.status(500).json({ success: false, message: "Error actualizando servicio.", data: [] });
  }
}

export async function deleteServicioController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Id inválido.", data: [] });
    }
    const ok = await deleteServicioDB(id);
    if (!ok) {
      return res.status(404).json({ success: false, message: "No encontrado.", data: [] });
    }
    return res.json({ success: true, message: "Servicio eliminado.", data: [] });
  } catch (err) {
    console.error("deleteServicioController:", err);
    return res.status(500).json({ success: false, message: "Error eliminando servicio.", data: [] });
  }
}
