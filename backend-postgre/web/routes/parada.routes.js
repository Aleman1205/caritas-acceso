import express from "express";
import { createParadaController, getParadaByNombreController } from "../controllers/parada.controller.js";

export const router = express.Router();

// POST /web/parada
router.post("/", createParadaController);

// GET /web/parada/:nombre
router.get("/:nombre", getParadaByNombreController);

export default router; // <- necesario para el autoload en ESM
