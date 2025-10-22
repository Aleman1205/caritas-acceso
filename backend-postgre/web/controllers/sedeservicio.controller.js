import { createSedeServicioDB, getSedeServicioByIdDB } from "../handlers/sedeservicio.handler.js";

/**
 * POST /web/sedeservicio
 * body: { descripcion?, capacidad?, precio?, horainicio?, horafinal?, estatus?, idsede, idservicio }
 * resp: { success, message, data }
 */
export async function createSedeServicioController(req, res) {
  try {
    const {
      descripcion,
      capacidad,
      precio,
      horainicio,
      horafinal,
      estatus,
      idsede,
      idservicio,
    } = req.body || {};

    if (!idsede || !idservicio) {
      return res.status(400).json({
        success: false,
        message: "idsede e idservicio son obligatorios.",
        data: null,
      });
    }

    if (Number.isNaN(Number(idsede)) || Number.isNaN(Number(idservicio))) {
      return res.status(400).json({
        success: false,
        message: "idsede e idservicio deben ser enteros.",
        data: null,
      });
    }

    const relation = await createSedeServicioDB({
      descripcion,
      capacidad,
      precio,
      horainicio,
      horafinal,
      estatus: Estatus, // mapeamos mayúscula -> minúscula
      idsede: IdSede,
      idservicio: IdServicio,
    });

    return res.status(201).json({
      success: true,
      message: "Relación sede-servicio creada correctamente.",
      data: relation,
    });
  } catch (err) {
    console.error("Error creating sede-servicio relation:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}

/**
 * GET /web/sedeservicio/:id
 * params: { id }
 * resp: { success, message, data }
 */
export async function getSedeServicioByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'id' es obligatorio y debe ser un número.",
        data: null,
      });
    }

    const relacion = await getSedeServicioByIdDB(id);

    if (!relacion) {
      return res.status(404).json({
        success: false,
        message: `No se encontró una relación sede-servicio con id ${id}.`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Relación sede-servicio obtenida correctamente.",
      data: relacion,
    });
  } catch (err) {
    console.error("Error fetching sede-servicio:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
      data: null,
    });
  }
}
