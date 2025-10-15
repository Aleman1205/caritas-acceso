import type { Request } from "express";
import {
	isPositiveInt,
	isPositiveIntStringValid,
	isValidString,
} from "../../functions/typeValidation.js";
import BaseValidadorRequest from "./base.js";
import type Usuario from "../../../types/db/Usuario.js";

export default class UsuarioValidador extends BaseValidadorRequest<Usuario> {
	// Valida el cuerpo (para POST o PUT)
	public override isBody(obj: Request["body"]): boolean {
		return (
			obj !== undefined &&
			(obj?.Email === undefined || isValidString(obj.Email, 300)) &&
			(obj?.Telefono === undefined || isValidString(obj.Telefono, 25)) &&
			(obj?.Nombre === undefined || isValidString(obj.Nombre, 70)) &&
			(obj?.Apellido === undefined || isValidString(obj.Apellido, 50)) &&
			(obj?.IdTipoUsuario === undefined || isPositiveInt(obj.IdTipoUsuario))
		);
	}

	// Valida los parámetros de búsqueda (GET con filtros)
	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.Email === undefined ||
				(typeof obj.Email === "string" && isValidString(obj.Email, 300))) &&
			(obj?.Telefono === undefined ||
				(typeof obj.Telefono === "string" && isValidString(obj.Telefono, 25))) &&
			(obj?.Nombre === undefined ||
				(typeof obj.Nombre === "string" && isValidString(obj.Nombre, 70))) &&
			(obj?.Apellido === undefined ||
				(typeof obj.Apellido === "string" && isValidString(obj.Apellido, 50))) &&
			(obj?.IdTipoUsuario === undefined ||
				(typeof obj.IdTipoUsuario === "string" && isPositiveIntStringValid(obj.IdTipoUsuario)))
		);
	}

	// Valida parámetros en la URL (por ejemplo /:Email)
	public override isParam(obj: Request["params"]): boolean {
		return (
			obj?.Email !== undefined &&
			typeof obj.Email === "string" &&
			isValidString(obj.Email, 300)
		);
	}

	// Valida si se envía un arreglo de Emails (para eliminar en lote)
	public override isBodyIds(obj: Request["body"]): boolean {
		return (
			obj?.Ids !== undefined &&
			Array.isArray(obj.Ids) &&
			obj.Ids.every((id: unknown) => typeof id === "string" && isValidString(id, 300))
		);
	}

	// Convierte los filtros del query a un objeto flexible (sin depender del tipo exacto)
	public override getFiltrosQuery(obj: Request["query"]): Record<string, any> {
		const filtros: Record<string, any> = {};

		if (obj?.Email !== undefined) filtros.Email = String(obj.Email);
		if (obj?.Telefono !== undefined) filtros.Telefono = String(obj.Telefono);
		if (obj?.Nombre !== undefined) filtros.Nombre = String(obj.Nombre);
		if (obj?.Apellido !== undefined) filtros.Apellido = String(obj.Apellido);
		if (obj?.IdTipoUsuario !== undefined)
			filtros.IdTipoUsuario = Number(obj.IdTipoUsuario);

		return filtros;
	}
}
