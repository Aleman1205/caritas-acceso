import express from "express";
import {
  createServicioController,
  listServiciosController,
  findServiciosByNombreController,
  getServicioByIdController,
  updateServicioController,
  deleteServicioController,
} from "../controllers/servicio.controller.js";

export const router = express.Router();

// CRUD básico
router.post("/", createServicioController);        // POST   /web/servicio
router.get("/", listServiciosController);          // GET    /web/servicio

// Búsqueda por nombre usando query param (?q=texto)
router.get("/search", findServiciosByNombreController); // GET /web/servicio/search?q=algo

// Obtener por id, actualizar y borrar
router.get("/id/:id", getServicioByIdController);  // GET    /web/servicio/id/123
router.put("/:id", updateServicioController);      // PUT    /web/servicio/123
router.delete("/:id", deleteServicioController);   // DELETE /web/servicio/123
