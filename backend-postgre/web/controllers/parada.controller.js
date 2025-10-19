const { createParada } = require('../handlers/parada.handler');

// Create a new parada
const createParadaController = async (req, res) => {
  try {
    const { nombre, descripcion, ubicacion, estatus, idsede } = req.body;

    if (!nombre || !ubicacion || !idsede) {
      return res.status(400).json({ error: 'Nombre, ubicación e idSede son obligatorios.' });
    }

    const parada = await createParada({ nombre, descripcion, ubicacion, estatus, idsede });
    res.status(201).json(parada);
  } catch (err) {
    console.error('Error creating parada:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { createParadaController };
