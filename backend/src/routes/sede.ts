import { Router } from "express";
import SedeDbService from "../db/sede.js";
import SedeController from "../controllers/sede.js";
import SedeHttpHandler from "../handlers/sede.js";
import { dbPool } from "../config/db/mysql.js";
import SedeValidadorRequest from "../utils/validadores/requests/sede.js";

const router = Router();

// wiring de dependencias
const service = new SedeDbService(dbPool);
const controller = new SedeController(service);
const validadorRequest = new SedeValidadorRequest();
const handler = new SedeHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;