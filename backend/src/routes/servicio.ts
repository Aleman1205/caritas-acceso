import { Router } from "express";
import ServicioDbService from "../db/servicio.js";
import ServicioController from "../controllers/servicio.js";
import ServicioHttpHandler from "../handlers/servicio.js";
import { dbPool } from "../config/db/mysql.js";
import ServicioValidadorRequest from "../utils/validadores/requests/servicio.js";

const router = Router();

// wiring de dependencias
const service = new ServicioDbService(dbPool);
const controller = new ServicioController(service);
const validadorRequest = new ServicioValidadorRequest();
const handler = new ServicioHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;