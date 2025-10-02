import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidTime } from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type { Ruta } from "../../../types/db/Ruta.js";
import type { RutaRequest } from "../../../types/requests/ruta.js";

function isRuta(obj: any): obj is Omit<Ruta,"IdSedeServicio"> {
  return (
    isPositiveInt(obj?.Orden) &&
    isValidTime(obj?.Hora) &&
    isPositiveInt(obj?.IdParada)
  );
}

export default class RutaValidador extends BaseValidadorRequest<Ruta> {
  public override isBody(obj: Request["body"]): boolean {
    return (
      typeof obj?.IdSedeServicio === "number" &&
      isPositiveInt(obj.IdSedeServicio) &&
      Array.isArray(obj?.Rutas) &&
      obj.Rutas.every(isRuta) &&
      obj.Rutas.every((r:any, i:number) => r.Orden === i + 1)
    );
  }

  public override isQuery(obj: Request["query"]): boolean {
    return (
      (obj?.IdSedeServicio === undefined || (typeof obj?.IdSedeServicio === "string" && isPositiveIntStringValid(obj.IdSedeServicio))) &&
      (obj?.Orden === undefined || (typeof obj?.Orden === "string" && isPositiveIntStringValid(obj.Orden))) &&
      (obj?.Hora === undefined || isValidTime(obj?.Hora)) &&
      (obj?.IdParada === undefined || (typeof obj?.IdParada === "string" && isPositiveIntStringValid(obj.IdParada)))
    );
  }

  public override isParam(obj: Request["params"]): boolean {
    return (
      obj?.IdSedeServicio !== undefined &&
      typeof obj.IdSedeServicio === "string" &&
      isPositiveIntStringValid(obj.IdSedeServicio)
    );
  }

  public override isBodyKeys(obj: Request["body"]): boolean {
    return Array.isArray(obj?.Keys) &&
      obj.Keys.every((k: any) =>
        k && isPositiveInt(k.IdSedeServicio) && isPositiveInt(k.Orden)
      );
  }

  public override getFiltrosQuery(obj: RutaRequest["query"]): Partial<Ruta> {
    const filtros: Partial<Ruta> = {};
    if (obj?.IdSedeServicio !== undefined) filtros.IdSedeServicio = Number(obj.IdSedeServicio);
    if (obj?.Orden !== undefined) filtros.Orden = Number(obj.Orden);
    if (obj?.Hora !== undefined) filtros.Hora = obj.Hora;
    if (obj?.IdParada !== undefined) filtros.IdParada = Number(obj.IdParada);
    return filtros;
  }
}