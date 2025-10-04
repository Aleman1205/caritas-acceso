import { Router } from "express";
import RutaDbService from "../db/ruta.js";
import RutaController from "../controllers/ruta.js";
import RutaHttpHandler from "../handlers/ruta.js";
import { dbPool } from "../config/db/mysql.js";
import RutaValidadorRequest from "../utils/validadores/requests/ruta.js";

const router = Router();

// wiring de dependencias
const service = new RutaDbService(dbPool);
const controller = new RutaController(service);
const validadorRequest = new RutaValidadorRequest();
const handler = new RutaHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;
