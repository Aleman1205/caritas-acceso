import { Router } from "express";
import BeneficiarioDbService from "../db/beneficiario.js";
import BeneficiarioController from "../controllers/beneficiario.js";
import BeneficiarioHttpHandler from "../handlers/beneficiario.js";
import { dbPool } from "../config/db/mysql.js";
import BeneficiarioValidador from "../utils/validadores/requests/beneficiario.js";


const router = Router();

// Wiring de dependencias
const service = new BeneficiarioDbService(dbPool);
const controller = new BeneficiarioController(service);
const validadorRequest = new BeneficiarioValidador();
const handler = new BeneficiarioHttpHandler(controller, validadorRequest);

// Rutas
router.post("/crear", handler.create.bind(handler));

// Obtener todos los beneficiarios
router.get("/obtener", handler.getAll.bind(handler));

// Obtener un beneficiario específico (por Teléfono + IdTransaccion)
router.get("/obtener/:Telefono/:IdTransaccion", handler.getOne.bind(handler));

// Modificar (también con ambas claves, si lo implementas después)
router.put("/modificar/:Telefono/:IdTransaccion", handler.update.bind(handler));

// Eliminar
router.delete("/eliminar/:Telefono/:IdTransaccion", handler.deleteOne.bind(handler));

export default router;
