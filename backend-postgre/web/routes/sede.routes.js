import express from "express";
import { 
  createSedeController, 
  getSedeByNombreController, 
  getAllSedesController, 
  updateSedeController, 
  deleteSedesController 
} from "../controllers/sede.controller.js";

export const router = express.Router();

router.post("/", createSedeController);
router.get("/", getAllSedesController);
router.get("/:nombre", getSedeByNombreController);
router.put("/:id", updateSedeController);
router.delete("/", deleteSedesController);

export default router;
