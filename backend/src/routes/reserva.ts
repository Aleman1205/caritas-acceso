import { Router } from "express";
import ReservaDbService from "../db/reserva.js";
import ReservaController from "../controllers/reserva.js";
import ReservaHttpHandler from "../handlers/reserva.js";
import { dbPool } from "../config/db/mysql.js";
import ReservaValidadorRequest from "../utils/validadores/requests/reserva.js";

const router = Router();

// wiring de dependencias
const service = new ReservaDbService(dbPool);
const controller = new ReservaController(service);
const validadorRequest = new ReservaValidadorRequest();
const handler = new ReservaHttpHandler(controller, validadorRequest);


// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:IdTransaccion", handler.getOne.bind(handler));
router.put("/modificar/:IdTransaccion", handler.update.bind(handler));
router.delete("/eliminar/:IdTransaccion", handler.deleteOne.bind(handler));



export default router;
