import express from "express";
import {
  getParadas,
  getParadasBySede,
  createParada,
  updateParada,
  deleteParada,
} from "../handlers/parada.handler.js";

export const router = express.Router();

// /web/parada
router.get("/", getParadas);

// /web/parada/sede/:id
router.get("/sede/:id", getParadasBySede);

// /web/parada
router.post("/", createParada);

// /web/parada/:id
router.put("/:id", updateParada);

// /web/parada/:id
router.delete("/:id", deleteParada);
