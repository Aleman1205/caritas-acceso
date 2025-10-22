import express from "express";
import { listarSedes, listarServiciosPorSede } from "../controllers/sedesController.js";

export const router = express.Router();

router.get("/", listarSedes);
router.get("/:id/servicios", listarServiciosPorSede);