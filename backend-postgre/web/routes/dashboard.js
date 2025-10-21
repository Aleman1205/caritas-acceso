// web/routes/dashboard.js
import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";

export const router = express.Router();

// Verifica que el router se cargó (opcional)
console.log("[web] dashboard.js router cargado");

// Con tu web/index.js, este router queda montado en /web/dashboard
router.get("/", getDashboard);

// Ruta de ping opcional para diagnóstico rápido
router.get("/ping", (req, res) => {
  res.json({ pong: true, at: "/web/dashboard/ping" });
});
