const { createSedeServicio } = require('../handlers/sedeservicio.handler');

// Create new SedeServicio relation
const createSedeServicioController = async (req, res) => {
  try {
    const { descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio } = req.body;

    if (!idsede || !idservicio) {
      return res.status(400).json({ error: 'IdSede e IdServicio son obligatorios.' });
    }

    const relation = await createSedeServicio({ descripcion, capacidad, precio, horainicio, horafinal, estatus, idsede, idservicio });
    res.status(201).json(relation);
  } catch (err) {
    console.error('Error creating sede-servicio relation:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { createSedeServicioController };
