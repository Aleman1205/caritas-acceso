import type { Request } from "express";
import {
  isPositiveInt,
  isPositiveIntStringValid,
  hasPositiveValidLengthParts,
  isValidString
} from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type { Compra } from "../../../types/db/Compra.js";
import type { CompraRequest } from "../../../types/requests/compra.js";

export default class CompraValidadorRequest extends BaseValidadorRequest<Compra> {
  // Verifica si una cadena es una fecha válida (compatible con DATETIME)
  private isValidDateTime(value: unknown): boolean {
    if (typeof value !== "string" && !(value instanceof Date)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // POST / PUT
  public override isBody(obj: Request["body"]): boolean {
    return (
      (obj?.IdTransaccion === undefined || isValidString(obj.IdTransaccion, 200)) &&
      (obj?.Total === undefined || hasPositiveValidLengthParts(obj.Total, 6, 2)) &&
      (obj?.Fecha === undefined || this.isValidDateTime(obj.Fecha)) && // valida correctamente fechas tipo DATETIME
      (obj?.IdSede === undefined || isPositiveInt(obj.IdSede)) &&
      (obj?.IdServicio === undefined || isPositiveInt(obj.IdServicio))
    );
  }

  // GET query filters
  public override isQuery(obj: Request["query"]): boolean {
    return (
      (obj?.IdTransaccion === undefined || isValidString(String(obj.IdTransaccion), 200)) &&
      (obj?.Total === undefined || hasPositiveValidLengthParts(Number(obj.Total), 6, 2)) &&
      (obj?.Fecha === undefined || this.isValidDateTime(obj.Fecha)) && //validación corregida aquí también
      (obj?.IdSede === undefined || (typeof obj.IdSede === "string" && isPositiveIntStringValid(obj.IdSede))) &&
      (obj?.IdServicio === undefined || (typeof obj.IdServicio === "string" && isPositiveIntStringValid(obj.IdServicio)))
    );
  }

  public override isParam(obj: Request["params"]): boolean {
    return (
      obj?.IdTransaccion !== undefined &&
      typeof obj.IdTransaccion === "string" &&
      isValidString(obj.IdTransaccion, 200)
    );
  }

  public override isBodyIds(obj: Request["body"]): boolean {
    return (
      obj?.IdsTransaccion !== undefined &&
      Array.isArray(obj.IdsTransaccion) &&
      obj.IdsTransaccion.every(
        (id: unknown) => typeof id === "string" && isValidString(id, 200)
      )
    );
  }

  public override getFiltrosQuery(obj: CompraRequest["query"]): Partial<Compra> {
    const filtros: Partial<Compra> = {};
    if (obj?.IdTransaccion !== undefined) filtros.IdTransaccion = String(obj.IdTransaccion);
    if (obj?.Total !== undefined) filtros.Total = Number(obj.Total);
    if (obj?.Fecha !== undefined && this.isValidDateTime(obj.Fecha))
      filtros.Fecha = new Date(obj.Fecha).toISOString().slice(0, 19).replace("T", " "); // Formato DATETIME MySQL
    if (obj?.IdSede !== undefined) filtros.IdSede = Number(obj.IdSede);
    if (obj?.IdServicio !== undefined) filtros.IdServicio = Number(obj.IdServicio);
    return filtros;
  }
}
