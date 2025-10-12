import { Router } from "express";
import CompraDbService from "../db/compra.js";
import CompraController from "../controllers/compra.js";
import CompraHttpHandler from "../handlers/compra.js";
import { dbPool } from "../config/db/mysql.js";
import CompraValidadorRequest from "../utils/validadores/requests/compra.js";

const router = Router();

// wiring de dependencias
const service = new CompraDbService(dbPool);
const controller = new CompraController(service);
const validadorRequest = new CompraValidadorRequest();
const handler = new CompraHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getById.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;
