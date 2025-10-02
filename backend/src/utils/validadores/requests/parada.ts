import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidString } from "../../functions/typeValidation.js";
import { toBoolStrict } from "../../functions/toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { Parada } from "../../../types/db/Parada.js";
import type { ParadaRequest } from "../../../types/requests/parada.js";

export default class ParadaValidador extends BaseValidadorRequest<Parada> {
    public override isBody(obj: Request["body"]): boolean {
        return (
            (obj?.Id === undefined || (typeof obj?.Id === "number" && isPositiveInt(obj?.Id))) &&
            (obj?.Nombre === undefined || isValidString(obj?.Nombre, 40)) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100) || obj?.Descripcion === null) &&
            (obj?.Ubicacion === undefined || isValidString(obj?.Ubicacion, 400)) &&
            (obj?.Estatus === undefined || typeof obj?.Estatus === "boolean")
        );
    }

    public override isQuery(obj: Request["query"]): boolean {
        return (
            (obj?.Id === undefined || (typeof obj?.Id === "string" && isPositiveIntStringValid(obj.Id))) &&
            (obj?.Nombre === undefined || isValidString(obj?.Nombre, 40)) &&
            (obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100)) &&
            (obj?.Ubicacion === undefined || isValidString(obj?.Ubicacion, 400)) &&
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

    public override getFiltrosQuery(obj: ParadaRequest["query"]): Partial<Parada> {
        const filtros: Partial<Parada> = {};

        if (obj?.Id !== undefined) filtros.Id = Number(obj.Id);
        if (obj?.Nombre !== undefined) filtros.Nombre = obj.Nombre;
        if (obj?.Descripcion !== undefined) filtros.Descripcion = obj.Descripcion;
        if (obj?.Ubicacion !== undefined) filtros.Ubicacion = obj.Ubicacion;
        const b = obj?.Estatus !== undefined ? toBoolStrict(obj.Estatus) : null;
        if (b !== null) filtros.Estatus = b;


        return filtros;
    }
}