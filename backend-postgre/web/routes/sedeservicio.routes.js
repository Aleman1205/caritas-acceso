import express from "express";
import {
  createSedeServicioController,
  getSedeServicioByIdController,
} from "../controllers/sedeservicio.controller.js";

export const router = express.Router();

// POST /web/sedeservicio
router.post("/", createSedeServicioController);

// GET /web/sedeservicio/:id
router.get("/:id", getSedeServicioByIdController);

export default router; // necesario para tu autoloader
