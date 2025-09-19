import { Router } from "express";
import SedeDbService from "../db/sede.js";
import SedeController from "../controllers/sede.js";
import { SedeHttpHandler } from "../handlers/sede.js";
import { dbPool } from "../config/db/mysql.js";

const router = Router();

// wiring de dependencias
const service = new SedeDbService(dbPool);
const controller = new SedeController(service);
const handler = new SedeHttpHandler(controller);

// rutas
router.post("/", handler.crearSede.bind(handler));
router.get("/:Id?", handler.getSede.bind(handler));
router.put("/:Id", handler.updateSede.bind(handler));
router.delete("/", handler.deleteSedes.bind(handler));
