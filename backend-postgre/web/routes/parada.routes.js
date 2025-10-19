import express from "express";
import { createParadaController } from "../controllers/parada.controller.js";

export const router = express.Router();

// POST /web/parada
router.post("/", createParadaController);

export default router; // <- necesario para el autoload en ESM
