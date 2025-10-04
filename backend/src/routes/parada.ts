import { Router } from "express";
import ParadaDbService from "../db/parada.js";
import ParadaController from "../controllers/parada.js";
import ParadaHttpHandler from "../handlers/parada.js";
import { dbPool } from "../config/db/mysql.js";
import ParadaValidadorRequest from "../utils/validadores/requests/parada.js";

const router = Router();

// wiring de dependencias
const service = new ParadaDbService(dbPool);
const controller = new ParadaController(service);
const validadorRequest = new ParadaValidadorRequest();
const handler = new ParadaHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;
