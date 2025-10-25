import type { Request } from "express";
import { isPositiveInt, isPositiveIntStringValid, isValidString, isValidTime } from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type { Sede } from "../../../types/db/sede.js";
import type { SedeRequest } from "../../../types/requests/sede.js";

export default class SedeValidador extends BaseValidadorRequest<Sede> {
	public override isBody(obj: Request["body"]): boolean {
		return (
			(obj?.Id === undefined || (typeof obj?.Id === "number" && isPositiveInt(obj?.Id))) &&
			(obj?.Nombre === undefined || isValidString(obj?.Nombre, 100)) &&
			(obj?.Ubicacion === undefined || isValidString(obj?.Ubicacion, 400)) &&
			(obj?.Ciudad === undefined || isValidString(obj?.Ciudad, 100)) &&
			(obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
			(obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal)) &&
			(obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100) || obj?.Descripcion === null)
		);
	}

	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.Id === undefined || (typeof obj?.Id === "string" && isPositiveIntStringValid(obj.Id))) &&
			(obj?.Nombre === undefined || isValidString(obj?.Nombre, 100)) &&
			(obj?.Ubicacion === undefined || isValidString(obj?.Ubicacion, 400)) &&
			(obj?.Ciudad === undefined || isValidString(obj?.Ciudad, 100)) &&
			(obj?.HoraInicio === undefined || isValidTime(obj?.HoraInicio)) &&
			(obj?.HoraFinal === undefined || isValidTime(obj?.HoraFinal)) &&
			(obj?.Descripcion === undefined || isValidString(obj?.Descripcion, 100))
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

	public override getFiltrosQuery(obj: SedeRequest["query"]): Partial<Sede> {
		const filtros: Partial<Sede> = {};

		if (obj?.Id !== undefined) filtros.Id = Number(obj.Id);
		if (obj?.Nombre !== undefined) filtros.Nombre = obj.Nombre;
		if (obj?.Ubicacion !== undefined) filtros.Ubicacion = obj.Ubicacion;
		if (obj?.Ciudad !== undefined) filtros.Ciudad = obj.Ciudad;
		if (obj?.HoraInicio !== undefined) filtros.HoraInicio = obj.HoraInicio;
		if (obj?.HoraFinal !== undefined) filtros.HoraFinal = obj.HoraFinal;
		if (obj?.Descripcion !== undefined) filtros.Descripcion = obj.Descripcion;

		return filtros;
	}
}