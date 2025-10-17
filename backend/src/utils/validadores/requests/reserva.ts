import type { Request } from "express";
import {
	isPositiveInt,
	isPositiveIntStringValid,
	isValidString,
} from "../../functions/typeValidation.js";
import { toBoolStrict } from "../../functions/toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { Reserva } from "../../../types/db/reserva.js";

export default class ReservaValidador extends BaseValidadorRequest<Reserva> {
	// Valida el cuerpo de la petición (POST / PUT)
	public override isBody(obj: Request["body"]): boolean {
		return (
			(obj?.IdTransaccion === undefined || isValidString(obj.IdTransaccion, 50)) &&
			(obj?.FechaInicio === undefined || isValidString(obj.FechaInicio, 30)) &&
			(obj?.FechaSalida === undefined || isValidString(obj.FechaSalida, 30)) &&
			(obj?.NumeroHombres === undefined ||
				(typeof obj.NumeroHombres === "number" && isPositiveInt(obj.NumeroHombres))) &&
			(obj?.NumeroMujeres === undefined ||
				(typeof obj.NumeroMujeres === "number" && isPositiveInt(obj.NumeroMujeres))) &&
			(obj?.IdSede === undefined ||
				(typeof obj.IdSede === "number" && isPositiveInt(obj.IdSede)))
		);
	}
	

	// Valida los parámetros de búsqueda (GET con filtros)
	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.IdTransaccion === undefined ||
				(typeof obj.IdTransaccion === "string" && isValidString(obj.IdTransaccion, 50))) &&

			(obj?.FechaInicio === undefined ||
				(typeof obj.FechaInicio === "string" && isValidString(obj.FechaInicio, 30))) &&

			(obj?.FechaSalida === undefined ||
				(typeof obj.FechaSalida === "string" && isValidString(obj.FechaSalida, 30))) &&

			(obj?.NumeroHombres === undefined ||
				(typeof obj.NumeroHombres === "string" && isPositiveIntStringValid(obj.NumeroHombres))) &&

			(obj?.NumeroMujeres === undefined ||
				(typeof obj.NumeroMujeres === "string" && isPositiveIntStringValid(obj.NumeroMujeres))) &&

			(obj?.IdSede === undefined ||
				(typeof obj.IdSede === "string" && isPositiveIntStringValid(obj.IdSede)))
		);
	}

	// Valida los parámetros en la URL (por ejemplo /:IdTransaccion)
	public override isParam(obj: Request["params"]): boolean {
		return (
			obj?.IdTransaccion !== undefined &&
			typeof obj.IdTransaccion === "string" &&
			isValidString(obj.IdTransaccion, 50)
		);
	}

	// Valida si se envía un arreglo de Ids (para eliminar en lote)
	public override isBodyIds(obj: Request["body"]): boolean {
		return (
			obj?.Ids !== undefined &&
			Array.isArray(obj.Ids) &&
			obj.Ids.every((id: unknown) => typeof id === "string" && isValidString(id, 50))
		);
	}

	// Convierte los filtros del query a un objeto parcial de Reserva
	public override getFiltrosQuery(obj: Request["query"]): Partial<Reserva> {
		const filtros: Partial<Reserva> = {};

		if (obj?.IdTransaccion !== undefined)
			filtros.IdTransaccion = String(obj.IdTransaccion);
		if (obj?.FechaInicio !== undefined)
			filtros.FechaInicio = String(obj.FechaInicio);
		if (obj?.FechaSalida !== undefined)
			filtros.FechaSalida = String(obj.FechaSalida);
		if (obj?.NumeroHombres !== undefined)
			filtros.NumeroHombres = Number(obj.NumeroHombres);
		if (obj?.NumeroMujeres !== undefined)
			filtros.NumeroMujeres = Number(obj.NumeroMujeres);
		if (obj?.IdSede !== undefined)
			filtros.IdSede = Number(obj.IdSede);

		return filtros;
	}
}
