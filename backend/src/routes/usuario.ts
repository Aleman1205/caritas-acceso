import { Router } from "express";
import UsuarioDbService from "../db/usuario.js";
import UsuarioController from "../controllers/usuario.js";
import UsuarioHttpHandler from "../handlers/usuario.js";
import { dbPool } from "../config/db/mysql.js";
import UsuarioValidadorRequest from "../utils/validadores/requests/usuario.js";

const router = Router();

// wiring de dependencias
const service = new UsuarioDbService(dbPool);
const controller = new UsuarioController(service);
const validadorRequest = new UsuarioValidadorRequest();
const handler = new UsuarioHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:Id", handler.getAll.bind(handler));
router.put("/modificar/:Id", handler.update.bind(handler));
router.delete("/eliminar", handler.deleteMany.bind(handler));

export default router;
