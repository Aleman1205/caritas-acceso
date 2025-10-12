import { Router } from "express";
import BeneficiarioDbService from "../db/beneficiario.js";
import BeneficiarioController from "../controllers/beneficiario.js";
import BeneficiarioHttpHandler from "../handlers/beneficiario.js";
import { dbPool } from "../config/db/mysql.js";
import BeneficiarioValidadorRequest from "../utils/validadores/requests/beneficiario.js";

const router = Router();

// wiring de dependencias
const service = new BeneficiarioDbService(dbPool);
const controller = new BeneficiarioController(service);
const validadorRequest = new BeneficiarioValidadorRequest();
const handler = new BeneficiarioHttpHandler(controller, validadorRequest);

// rutas
router.post("/crear", handler.create.bind(handler));
router.get("/obtener", handler.getAll.bind(handler));
router.get("/obtener/:IdTransaccion", handler.getOne.bind(handler));
router.put("/modificar/:Telefono", handler.update.bind(handler));
router.delete("/eliminar/:Telefono/:IdTransaccion", handler.deleteOne.bind(handler));



export default router;
