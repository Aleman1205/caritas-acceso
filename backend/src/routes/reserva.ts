import { Router } from "express";
import ReservaDbService from "../db/reserva.js";
import ReservaController from "../controllers/reserva.js";
import ReservaHttpHandler from "../handlers/reserva.js";
import { dbPool } from "../config/db/mysql.js";
import ReservaValidador from "../utils/validadores/requests/reserva.js";

const router = Router();

// Wiring de dependencias
const service = new ReservaDbService(dbPool);
const controller = new ReservaController(service);
const validadorRequest = new ReservaValidador();
const handler = new ReservaHttpHandler(controller, validadorRequest);

// Rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:IdTransaccion", handler.getOne.bind(handler));
router.put("/modificar/:IdTransaccion", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;
