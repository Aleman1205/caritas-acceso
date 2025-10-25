// backend-postgre/web/controllers/resenasController.js
import { fetchResenas } from "../handlers/resenas.handler.js";

/** Mapea filas crudas -> shape para el front */
function mapRows(rows) {
  return (rows || []).map((r) => ({
    id: r.id,
    estrellas: r.int_estrellas,
    comentario: r.comentarios,
    idSede: r.id_sede,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

/** GET /web/resenas  (opcional: ?idSede=1) */
export async function getResenas(req, res) {
  try {
    const idSedeRaw = req.query.idSede ?? req.query.idsede;
    const idSede =
      idSedeRaw !== undefined && idSedeRaw !== null && String(idSedeRaw).trim() !== ""
        ? Number(idSedeRaw)
        : undefined;

    const rows = await fetchResenas({ idSede });
    return res.json({
      success: true,
      message: "Reseñas obtenidas correctamente.",
      data: mapRows(rows),
    });
  } catch (err) {
    console.error("Error getResenas:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reseñas",
      data: [],
    });
  }
}
