import express from "express";
import { solicitarTransporte } from "../controllers/transporteController.js";

export const router = express.Router();

router.post("/", solicitarTransporte);
