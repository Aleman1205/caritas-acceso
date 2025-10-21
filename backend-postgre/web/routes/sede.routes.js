import express from "express";
import { getSedeByNombreController  } from "../controllers/sede.controller.js";


export const router = express.Router();

// GET /web/sede/nombre
router.get("/:nombre", getSedeByNombreController);

export default router;
