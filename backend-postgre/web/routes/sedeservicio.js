import express from "express";
import {
  getSedes,
  getServicios,
  getAsignaciones,
  createAsignacion,
  updateAsignacion,
  deleteAsignacion,
} from "../handlers/sedeservicio.handler.js";

export const router = express.Router();

// SEDES
router.get("/sedes", getSedes);

// SERVICIOS
router.get("/servicios", getServicios);

// ASIGNACIONES sede_servicio
router.get("/asignaciones", getAsignaciones);
router.post("/asignaciones", createAsignacion);
router.put("/asignaciones/:id", updateAsignacion);
router.delete("/asignaciones/:id", deleteAsignacion);
