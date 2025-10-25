import express from "express";
import bodyParser from "body-parser";
import { obtenerPromedioRating, crearRating } from "../controllers/ratingsController.js";

export const router = express.Router();

router.use(bodyParser.json());

router.post("/crear", crearRating);

router.get("/promedio/:id_sede", obtenerPromedioRating);