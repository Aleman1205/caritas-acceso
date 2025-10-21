import express from "express";
import {
  getReservasPorTelefono,
  updateReservaEstado, // ⬅️ nuevo
} from "../controllers/reservasController.js";

export const router = express.Router();

// GET /web/reservas/:telefono  (igual que antes)
router.get("/:telefono", getReservasPorTelefono);

// PUT /web/reservas/modificar/:tx  (nuevo endpoint para cambiar estado)
router.put("/modificar/:tx", updateReservaEstado);

export default router;
