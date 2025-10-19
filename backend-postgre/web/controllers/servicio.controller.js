const { createServicio } = require('../handlers/servicio.handler');

// Create a new servicio
const createServicioController = async (req, res) => {
  try {
    const { nombre, descripcion, estatus } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Nombre y descripción son obligatorios.' });
    }

    const servicio = await createServicio({ nombre, descripcion, estatus });
    res.status(201).json(servicio);
  } catch (err) {
    console.error('Error creating servicio:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { createServicioController };
