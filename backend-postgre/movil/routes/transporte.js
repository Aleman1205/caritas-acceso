import express from "express";
import { obtenerDatosTransporte } from "../controllers/transporteController.js";

export const router = express.Router();

router.get("/", obtenerDatosTransporte);
