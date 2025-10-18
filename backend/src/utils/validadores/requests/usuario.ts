import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidString, isValidTime } from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type { Usuario } from "../../../types/db/Usuario.js";
import type { UsuarioRequest } from "../../../types/requests/usuario.js";

export default class UsuarioValidadorRequest extends BaseValidadorRequest<Usuario> {
    public override isBody(obj: Request["body"]): boolean {
        return (
            (obj?.Email === undefined || isValidString(obj.Email, 300)) &&
            (obj?.Telefono === undefined || isValidString(obj.Telefono, 25)) &&
            (obj?.Nombre === undefined || isValidString(obj.Nombre, 70)) &&
            (obj?.Apellido === undefined || isValidString(obj.Apellido, 50)) &&
            (obj?.FotoUrl === undefined || obj.FotoUrl==null ||isValidString(obj.FotoUrl, 500)) &&
            (obj?.FechaNacimiento === null || obj.FechaNacimiento==null || !isNaN(Date.parse(obj.FechaNacimiento))) &&
            (obj?.IdTipoUsuario === undefined || isPositiveInt(obj.IdTipoUsuario))
        );
    }

    public override isQuery(obj: Request["query"]): boolean {
        return (
            (obj?.Email === undefined || isValidString(String(obj.Email), 300)) &&
            (obj?.Telefono === undefined || isValidString(String(obj.Telefono), 25)) &&
            (obj?.Nombre === undefined || isValidString(String(obj.Nombre), 70)) &&
            (obj?.Apellido === undefined || isValidString(String(obj.Apellido), 50)) &&
            (obj?.FotoUrl === undefined || isValidString(String(obj.FotoUrl), 500)) &&
            (obj?.FechaNacimiento === undefined || isNaN(Date.parse(String(obj.FechaNacimiento)))) &&
            (obj?.IdTipoUsuario === undefined || isPositiveIntStringValid(String(obj.IdTipoUsuario)))
        );
    }

    public override isParam(obj: Request["params"]): boolean {
        return obj?.Email !== undefined && typeof obj.Email === "string" && isValidString(obj.Email, 300);
    }

    public override isBodyIds(obj: Request["body"]): boolean {
        return obj?.Emails !== undefined && Array.isArray(obj.Emails) && obj.Emails.every((id: unknown) => typeof id === "string" && isValidString(id, 300));
    }

    public override getFiltrosQuery(obj: UsuarioRequest["query"]): Partial<Usuario> {
        const filtros: Partial<Usuario> = {};
        if (obj?.Email !== undefined) filtros.Email = String(obj.Email);
        if (obj?.Telefono !== undefined) filtros.Telefono = String(obj.Telefono);
        if (obj?.Nombre !== undefined) filtros.Nombre = String(obj.Nombre);
        if (obj?.Apellido !== undefined) filtros.Apellido = String(obj.Apellido);
        if (obj?.FotoUrl !== undefined) filtros.FotoUrl = String(obj.FotoUrl);
        if (obj?.FechaNacimiento !== undefined) filtros.FechaNacimiento = String(obj.FechaNacimiento);
        if (obj?.IdTipoUsuario !== undefined) filtros.IdTipoUsuario = Number(obj.IdTipoUsuario);
        return filtros;
    }
}

