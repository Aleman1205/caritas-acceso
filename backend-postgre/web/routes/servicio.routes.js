import express from "express";
import { createServicioController } from "../controllers/servicio.controller.js";

export const router = express.Router();

// POST /web/servicio
router.post("/", createServicioController);

export default router;
