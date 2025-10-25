import express from "express";
import { obtenerSedesConServicios } from "../controllers/sedesInfoController.js";

export const router = express.Router();

router.get("/", obtenerSedesConServicios);