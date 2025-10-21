import express from "express";
import { getCupos, updateCupo } from "../controllers/cupos.controller.js";

export const router = express.Router();

// GET /web/cupos
router.get("/", getCupos);

// PUT /web/cupos/:id
router.put("/:id", updateCupo);

export default router;
