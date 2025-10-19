const express = require('express');
const router = express.Router();
const { createServicioController } = require('../controllers/servicio.controller');

// POST /servicio
router.post('/', createServicioController);

module.exports = router;
