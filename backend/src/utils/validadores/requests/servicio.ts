import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidString } from "../../functions/typeValidation.js";
import { toBoolStrict } from "../../functions/toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { Servicio } from "../../../types/db/servicio.js";
import type { ServicioRequest } from "../../../types/requests/servicio.js";

export default class ServicioValidador extends BaseValidadorRequest<Servicio> {
    public override isBody(obj: Request["body"]): boolean {
        return (
            (obj?.Id === undefined || (typeof obj?.Id === "number" && isPositiveInt(obj?.Id))) &&
            (obj?.Nombre === undefined || isValidString(obj?.Nombre, 40)) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100) || obj?.Descripcion === null) &&
            (obj?.Estatus === undefined || typeof obj?.Estatus === "boolean")
        );
    }

    public override isQuery(obj: Request["query"]): boolean {
        return (
            (obj?.Id === undefined || (typeof obj?.Id === "string" && isPositiveIntStringValid(obj.Id))) &&
            (obj?.Nombre === undefined || isValidString(obj?.Nombre, 40)) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100) || obj?.Descripcion === null) &&
            (obj?.Estatus === undefined || obj?.Estatus === "true" || obj?.Estatus === "false")
        );
    }

    public override isParam(obj: Request["params"]): boolean {
        return obj?.Id !== undefined && typeof obj.Id === "string" && isPositiveIntStringValid(obj.Id);
    }

    public override isBodyIds(obj: Request["body"]): boolean {
        return (
            obj?.Ids !== undefined &&
            Array.isArray(obj.Ids) &&
            obj.Ids.every((id: unknown) => isPositiveInt(id))
        );
    }

    public override getFiltrosQuery(obj: ServicioRequest["query"]): Partial<Servicio> {
        const filtros: Partial<Servicio> = {};

        if (obj?.Id !== undefined) filtros.Id = Number(obj.Id);
        if (obj?.Nombre !== undefined) filtros.Nombre = obj.Nombre;
        if (obj?.Descripcion !== undefined) filtros.Descripcion = obj.Descripcion;
        const b = obj?.Estatus !== undefined ? toBoolStrict(obj.Estatus) : null;
        if (b !== null) filtros.Estatus = b;

        return filtros;
    }
}