import {
  getSedesCtrl,
  getServiciosCtrl,
  getAsignacionesCtrl,
  createAsignacionCtrl,
  updateAsignacionCtrl,
  deleteAsignacionCtrl,
} from "../controllers/sedeservicio.controller.js";

export const getSedes = (req, res) => getSedesCtrl(req, res);
export const getServicios = (req, res) => getServiciosCtrl(req, res);

export const getAsignaciones = (req, res) => getAsignacionesCtrl(req, res);
export const createAsignacion = (req, res) => createAsignacionCtrl(req, res);
export const updateAsignacion = (req, res) => updateAsignacionCtrl(req, res);
export const deleteAsignacion = (req, res) => deleteAsignacionCtrl(req, res);
