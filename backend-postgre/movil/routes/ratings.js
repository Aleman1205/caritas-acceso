import express from "express";
import bodyParser from "body-parser"; // 👈 lo agregamos solo aquí
import { obtenerPromedioRating, crearRating } from "../controllers/ratingsController.js";

export const router = express.Router();

// Habilita JSON solo dentro de este router
router.use(bodyParser.json());

// POST: Crear un nuevo rating
router.post("/crear", crearRating);

// GET: Obtener promedio y total de reseñas por sede
router.get("/promedio/:id_sede", obtenerPromedioRating);
