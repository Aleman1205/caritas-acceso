import {
  getParadasCtrl,
  getParadasBySedeCtrl,
  createParadaCtrl,
  updateParadaCtrl,
  deleteParadaCtrl,
} from "../controllers/parada.controller.js";

export const getParadas = (req, res) => getParadasCtrl(req, res);
export const getParadasBySede = (req, res) => getParadasBySedeCtrl(req, res);
export const createParada = (req, res) => createParadaCtrl(req, res);
export const updateParada = (req, res) => updateParadaCtrl(req, res);
export const deleteParada = (req, res) => deleteParadaCtrl(req, res);
