import express from "express";
import { getReservasPorTelefono } from "../controllers/reservasController.js";

export const router = express.Router();

// GET /web/reservas/:telefono
router.get("/:telefono", getReservasPorTelefono);

export default router;
