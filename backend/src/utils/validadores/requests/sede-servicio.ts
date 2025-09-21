import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidString, hasPositiveValidLengthParts, isValidTime } from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type { SedeServicio } from "../../../types/db/SedeServicio.js";
import type { SedeServicioRequest } from "../../../types/requests/sede-servicio.js";

export default class SedeServicioValidador extends BaseValidadorRequest<SedeServicio> {
    public override isBody(obj: Request["body"]): boolean {
        return (
            (obj?.IdSede === undefined || (typeof obj?.IdSede === "number" && isPositiveInt(obj?.IdSede))) &&
            (obj?.IdServicio === undefined || (typeof obj?.IdServicio === "number" && isPositiveInt(obj?.IdServicio))) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100)) &&
            (obj?.Capacidad === undefined || hasPositiveValidLengthParts(obj?.Capacidad, 4, 0)) &&
            (obj?.Precio === undefined || hasPositiveValidLengthParts(obj?.Precio, 4, 2)) &&
            (obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
            (obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal))            
        );
    }

    public override isQuery(obj: Request["query"]): boolean {
        return (
            (obj?.IdSede === undefined || (typeof obj?.IdSede === "string" && isPositiveIntStringValid(obj.IdSede))) &&
            (obj?.IdServicio === undefined || (typeof obj?.IdServicio === "string" && isPositiveIntStringValid(obj.IdServicio))) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100)) &&
            (obj?.Capacidad === undefined || hasPositiveValidLengthParts(Number(obj?.Capacidad), 4, 0)) &&
            (obj?.Precio === undefined || hasPositiveValidLengthParts(Number(obj?.Precio), 4, 2)) &&
            (obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
            (obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal))
        );
    }

    public override isParam(obj: Request["params"]): boolean {
        return obj?.IdSede !== undefined && typeof obj.IdSede === "string" && isPositiveIntStringValid(obj.IdSede) &&
               obj?.IdServicio !== undefined && typeof obj.IdServicio === "string" && isPositiveIntStringValid(obj.IdServicio);
    }

    public override isBodyKeys(obj: Request["body"]): boolean {
        if (!obj || !Array.isArray(obj.Ids)) {
            return false;
        }

        return obj.Ids.every(
            (pair: unknown) =>
                Array.isArray(pair) &&
                pair.length === 2 &&
                pair.every(isPositiveInt)
        );
    }

    public override getFiltrosQuery(obj: SedeServicioRequest["query"]): Partial<SedeServicio> {
        const filtros: Partial<SedeServicio> = {};

        if (obj?.IdSede !== undefined) filtros.IdSede = Number(obj.IdSede);
        if (obj?.IdServicio !== undefined) filtros.IdServicio = Number(obj.IdServicio);
        if (obj?.Descripcion !== undefined) filtros.Descripcion = obj.Descripcion;
        if (obj?.Capacidad !== undefined) filtros.Capacidad = Number(obj.Capacidad);
        if (obj?.Precio !== undefined) filtros.Capacidad = Number(obj.Precio);
        if (obj?.HoraInicio !== undefined) filtros.HoraInicio = obj.HoraInicio;
        if (obj?.HoraFinal !== undefined) filtros.HoraFinal = obj.HoraFinal;        

        return filtros;
    }
}