import type { Request } from "express";
import { isPositiveInt, isIntStringValid } from "../../isIntStringValid.js";
import { toBoolStrict } from "../../toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { Servicio } from "../../../types/db/Servicio.js";
import type { ServicioRequest } from "../../../types/requests/servicio.js";

export default class ServicioValidadorRequest extends BaseValidadorRequest<Servicio> {
    public override isBody(obj: Request["body"]): boolean {
        return (

            (obj?.Id === undefined || typeof obj?.Id === "number") &&
            (obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
            (obj?.Descripcion === undefined || typeof obj?.Descripcion === "string" || obj?.Descripcion === null) &&
            (obj?.Estatus === undefined || typeof obj?.Estatus === "boolean")
        );
    }

    public override isQuery(obj: Request["query"]): boolean {
        return (
            (obj?.Id === undefined || (typeof obj?.Id === "string" && isIntStringValid(obj.Id))) &&
            (obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
            (obj?.Descripcion === undefined || typeof obj?.Descripcion === "string" || obj?.Descripcion === null) &&
            (obj?.Estatus === undefined || typeof obj?.Estatus === "boolean")
        );
    }

    public override isParam(obj: Request["params"]): boolean {
        return obj?.Id !== undefined && typeof obj.Id === "string" && isIntStringValid(obj.Id);
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
        if (obj?.Estatus !== undefined && toBoolStrict(obj.Estatus)) filtros.Estatus = obj.Estatus === "true" ? true : false;

        return filtros;
    }
}