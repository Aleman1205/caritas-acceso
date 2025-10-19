import express from "express";
import { createSedeServicioController } from "../controllers/sedeservicio.controller.js";

export const router = express.Router();

// POST /web/sedeservicio
router.post("/", createSedeServicioController);

export default router; // necesario para tu autoloader
