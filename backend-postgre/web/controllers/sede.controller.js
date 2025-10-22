import { 
  createSedeDB, 
  getSedeByNombreDB, 
  updateSedeDB, 
  deleteSedesDB, 
  getAllSedesDB 
} from "../handlers/sede.handler.js";

/** POST /web/sede */
export async function createSedeController(req, res) {
  try {
    const { nombre, ubicacion, ciudad, horainicio, horafinal, descripcion } = req.body;
    if (!nombre || !ubicacion || !ciudad) {
      return res.status(400).json({ success: false, message: "nombre, ubicacion y ciudad son obligatorios.", data: [] });
    }

    const sede = await createSedeDB({ nombre, ubicacion, ciudad, horainicio, horafinal, descripcion });
    return res.status(201).json({ success: true, message: "Sede creada correctamente.", data: [sede] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", data: [] });
  }
}

/** GET /web/sede/:nombre */
export async function getSedeByNombreController(req, res) {
  try {
    const { nombre } = req.params;
    if (!nombre) return res.status(400).json({ success: false, message: "El parámetro 'nombre' es obligatorio.", data: [] });

    const sedes = await getSedeByNombreDB(nombre);
    if (!sedes || sedes.length === 0) return res.status(404).json({ success: false, message: `No se encontró sede '${nombre}'`, data: [] });

    return res.status(200).json({ success: true, message: "Sede(s) obtenida(s) correctamente.", data: sedes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", data: [] });
  }
}

/** GET /web/sede */
export async function getAllSedesController(req, res) {
  try {
    const sedes = await getAllSedesDB();
    return res.status(200).json({ success: true, message: "Sedes obtenidas correctamente.", data: sedes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", data: [] });
  }
}

/** PUT /web/sede/:id */
export async function updateSedeController(req, res) {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, ciudad, horainicio, horafinal, descripcion } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Id es obligatorio.", data: [] });

    const updated = await updateSedeDB(Number(id), { nombre, ubicacion, ciudad, horainicio, horafinal, descripcion });
    return res.status(200).json({ success: true, message: "Sede actualizada correctamente.", data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", data: [] });
  }
}

/** DELETE /web/sede */
export async function deleteSedesController(req, res) {
  try {
    const { Ids } = req.body;
    if (!Array.isArray(Ids) || Ids.length === 0) return res.status(400).json({ success: false, message: "Ids son obligatorios.", data: [] });

    const deletedIds = await deleteSedesDB(Ids);
    return res.status(200).json({ success: true, message: "Sede(s) eliminada(s).", data: deletedIds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno del servidor.", data: [] });
  }
}
