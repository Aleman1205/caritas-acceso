import type { Request } from "express";
import {
	isPositiveInt,
	isValidString,
	isPositiveIntStringValid,
} from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type Compra from "../../../types/db/compra.js";

/**
 * Validador para las peticiones relacionadas con Compra.
 * Verifica que los campos cumplan el tipo y formato esperado.
 */
export default class CompraValidador extends BaseValidadorRequest<Compra> {
	// Valida el cuerpo de la petición (POST / PUT)
	public override isBody(obj: Request["body"]): boolean {
		return (
			obj !== undefined &&
			(obj?.IdTransaccion === undefined ||
				isValidString(obj.IdTransaccion, 50)) &&
			(obj?.Total === undefined ||
				(typeof obj.Total === "number" && isPositiveInt(obj.Total))) &&
			(obj?.Fecha === undefined || isValidString(obj.Fecha, 30)) &&
			(obj?.IdSede === undefined ||
				(typeof obj.IdSede === "number" && isPositiveInt(obj.IdSede))) &&
			(obj?.IdServicio === undefined ||
				(typeof obj.IdServicio === "number" && isPositiveInt(obj.IdServicio)))
		);
	}

	// Valida los parámetros de búsqueda (GET con filtros)
	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.IdTransaccion === undefined ||
				(typeof obj.IdTransaccion === "string" &&
					isValidString(obj.IdTransaccion, 50))) &&
			(obj?.IdSede === undefined ||
				(typeof obj.IdSede === "string" &&
					isPositiveIntStringValid(obj.IdSede))) &&
			(obj?.IdServicio === undefined ||
				(typeof obj.IdServicio === "string" &&
					isPositiveIntStringValid(obj.IdServicio)))
		);
	}

	// Valida parámetros en la ruta (por ejemplo /obtener/:IdTransaccion)
	public override isParam(obj: Request["params"]): boolean {
		return (
			obj?.IdTransaccion !== undefined &&
			typeof obj.IdTransaccion === "string" &&
			isValidString(obj.IdTransaccion, 50)
		);
	}

	// Valida el body cuando contiene varios Ids (para eliminar en lote)
	public override isBodyIds(obj: Request["body"]): boolean {
		return (
			obj?.Ids !== undefined &&
			Array.isArray(obj.Ids) &&
			obj.Ids.every(
				(id: unknown) => typeof id === "string" && isValidString(id, 50)
			)
		);
	}
}
