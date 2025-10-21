import express from "express";
import { createServicioController, getServicioByNombreController  } from "../controllers/servicio.controller.js";


export const router = express.Router();

// POST /web/servicio
router.post("/", createServicioController);

// GET /web/servicio/:nombre
router.get("/:nombre", getServicioByNombreController);

export default router;
