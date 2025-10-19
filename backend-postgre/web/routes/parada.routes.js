const express = require('express');
const router = express.Router();
const { createParadaController } = require('../controllers/parada.controller');

// POST /parada
router.post('/', createParadaController);

module.exports = router;
