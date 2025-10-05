import { Router } from "express";
import RutaDbService from "../db/ruta.js";
import RutaController from "../controllers/ruta.js";
import RutaHttpHandler from "../handlers/ruta.js";
import { dbPool } from "../config/db/mysql.js";
import RutaValidador from "../utils/validadores/requests/ruta.js";

const router = Router();

// wiring de dependencias
const service = new RutaDbService(dbPool);
const controller = new RutaController(service);
const validadorRequest = new RutaValidador();
const handler = new RutaHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:IdSedeServicio", handler.getAll.bind(handler));
router.put("/modificar", handler.syncRuta.bind(handler));

export default router;