import type { Request } from "express";
import {
  isPositiveInt,
  isPositiveIntStringValid,
  isValidString,
  hasPositiveValidLengthParts,
  isValidTime
} from "../../functions/typeValidation.js";
import { toBoolStrict } from "../../functions/toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { SedeServicio } from "../../../types/db/sede-servicio.js";
import type { SedeServicioRequest } from "../../../types/requests/sede-servicio.js";

export default class SedeServicioValidador extends BaseValidadorRequest<SedeServicio> {
  public override isBody(obj: Request["body"]): boolean {
    return (
      (obj?.Id === undefined || (typeof obj?.Id === "number" && isPositiveInt(obj.Id))) &&
      (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100)) &&
      (obj?.Capacidad === undefined || hasPositiveValidLengthParts(obj?.Capacidad, 4, 0)) &&
      (obj?.Precio === undefined || hasPositiveValidLengthParts(obj?.Precio, 4, 2)) &&
      (obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
      (obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal)) &&
      (
        obj?.Estatus === undefined ||
        typeof obj.Estatus === "boolean" ||
        (typeof obj.Estatus === "number" && (obj.Estatus === 0 || obj.Estatus === 1))
      ) &&
      (obj?.IdSede === undefined || (typeof obj?.IdSede === "number" && isPositiveInt(obj?.IdSede))) &&
      (obj?.IdServicio === undefined || (typeof obj?.IdServicio === "number" && isPositiveInt(obj?.IdServicio)))
    );
  }

  public override isQuery(obj: Request["query"]): boolean {
    return (
      (obj?.Id === undefined || (typeof obj?.Id === "string" && isPositiveIntStringValid(obj.Id))) &&
      (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100)) &&
      (obj?.Capacidad === undefined || hasPositiveValidLengthParts(Number(obj?.Capacidad), 4, 0)) &&
      (obj?.Precio === undefined || hasPositiveValidLengthParts(Number(obj?.Precio), 4, 2)) &&
      (obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
      (obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal)) &&
      (obj?.Estatus === undefined || toBoolStrict(String(obj.Estatus)) !== null) &&
      (obj?.IdSede === undefined || (typeof obj?.IdSede === "string" && isPositiveIntStringValid(obj.IdSede))) &&
      (obj?.IdServicio === undefined || (typeof obj?.IdServicio === "string" && isPositiveIntStringValid(obj.IdServicio)))
    );
  }

  public override isParam(obj: Request["params"]): boolean {
    return obj?.Id !== undefined && typeof obj.Id === "string" && isPositiveIntStringValid(obj.Id);
  }

  // DELETE many: Ids:number[]
  public override isBodyIds(obj: Request["body"]): boolean {
    if (!obj || !Array.isArray(obj.Ids)) return false;
    return obj.Ids.every(isPositiveInt);
  }

  public override getFiltrosQuery(obj: SedeServicioRequest["query"]): Partial<SedeServicio> {
    const filtros: Partial<SedeServicio> = {};

    if (obj?.Id !== undefined) filtros.Id = Number(obj.Id);
    if (obj?.Descripcion !== undefined) filtros.Descripcion = obj.Descripcion;
    if (obj?.Capacidad !== undefined) filtros.Capacidad = Number(obj.Capacidad);
    if (obj?.Precio !== undefined) filtros.Precio = Number(obj.Precio);
    if (obj?.HoraInicio !== undefined) filtros.HoraInicio = obj.HoraInicio;
    if (obj?.HoraFinal !== undefined) filtros.HoraFinal = obj.HoraFinal;

    if (obj?.Estatus !== undefined) {
      const b = toBoolStrict(String(obj.Estatus));
    }

    if (obj?.IdSede !== undefined) filtros.IdSede = Number(obj.IdSede);
    if (obj?.IdServicio !== undefined) filtros.IdServicio = Number(obj.IdServicio);

    return filtros;
  }
}