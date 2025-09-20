import type { Request } from "express";
import { isPositiveInt, isIntStringValid } from "../../isIntStringValid.js";
import BaseValidadorRequest from "./base.js";
import type { Sede } from "../../../types/db/Sede.js";
import type { SedeRequest } from "../../../types/requests/sede.js";

export default class SedeValidadorRequest extends BaseValidadorRequest<Sede> {
	public override isBody(obj: Request["body"]): boolean {
		return (
			(obj?.Id === undefined || typeof obj?.Id === "number") &&
			(obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
			(obj?.Ubicacion === undefined || typeof obj?.Ubicacion === "string") &&
			(obj?.Ciudad === undefined || typeof obj?.Ciudad === "string") &&
			(obj?.HoraInicio === undefined || typeof obj?.HoraInicio === "string") &&
			(obj?.HoraFinal === undefined || typeof obj?.HoraFinal === "string") &&
			(obj?.Descripcion === undefined || typeof obj?.Descripcion === "string" || obj?.Descripcion === null)
		);
	}

	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.Id === undefined || (typeof obj?.Id === "string" && isIntStringValid(obj.Id))) &&
			(obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
			(obj?.Ubicacion === undefined || typeof obj?.Ubicacion === "string") &&
			(obj?.Ciudad === undefined || typeof obj?.Ciudad === "string") &&
			(obj?.HoraInicio === undefined || typeof obj?.HoraInicio === "string") &&
			(obj?.HoraFinal === undefined || typeof obj?.HoraFinal === "string") &&
			(obj?.Descripcion === undefined || typeof obj?.Descripcion === "string")
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