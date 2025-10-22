// backend-postgre/web/routes/resenas.js
import express from "express";
import { getResenas } from "../controllers/resenasController.js";

export const router = express.Router();

/**
 * GET /web/resenas
 * Opcional: ?idSede=1 para filtrar por sede
 */
router.get("/", getResenas);
