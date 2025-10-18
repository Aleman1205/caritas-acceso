import { Router } from "express";
import SedeServicioDbService from "../db/sede-servicio.js";
import SedeServicioController from "../controllers/sede-servicio.js";
import SedeServicioHttpHandler from "../handlers/sede-servicio.js";
import { dbPool } from "../config/db/mysql.js";
import SedeServicioValidador from "../utils/validadores/requests/sede-servicio.js";

const router = Router();

// wiring de dependencias
const service = new SedeServicioDbService(dbPool);
const controller = new SedeServicioController(service);
const validadorRequest = new SedeServicioValidador();
const handler = new SedeServicioHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;