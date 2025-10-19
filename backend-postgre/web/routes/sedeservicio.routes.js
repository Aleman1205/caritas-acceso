const express = require('express');
const router = express.Router();
const { createSedeServicioController } = require('../controllers/sedeservicio.controller');

// POST /sedeservicio
router.post('/', createSedeServicioController);

module.exports = router;
