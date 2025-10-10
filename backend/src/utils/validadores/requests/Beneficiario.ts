import type { Request } from "express";
import {
	isPositiveInt,
	isPositiveIntStringValid,
	isValidString,
} from "../../functions/typeValidation.js";
import { toBoolStrict } from "../../functions/toBoolStrict.js";
import BaseValidadorRequest from "./base.js";
import type { Beneficiario } from "../../../types/db/Beneficiario.js";
// (opcional) si tienes un tipo BeneficiarioRequest para querys
// import type { BeneficiarioRequest } from "../../../types/requests/beneficiario.js";

export default class BeneficiarioValidador extends BaseValidadorRequest<Beneficiario> {
	//Valida el cuerpo de una petición (POST / PUT)
	public override isBody(obj: Request["body"]): boolean {
		return (
			(obj?.Telefono !== undefined && isValidString(obj.Telefono, 25)) &&
			(obj?.IdTransaccion === undefined || isValidString(obj.IdTransaccion, 200)) &&
			(obj?.Nombre === undefined || isValidString(obj.Nombre, 70)) &&
			(obj?.Apellido === undefined || isValidString(obj.Apellido, 50)) &&
			(obj?.Email === undefined || isValidString(obj.Email, 300) || obj?.Email === null)
		);
	}

	// Valida parámetros de consulta (GET con filtros)
	public override isQuery(obj: Request["query"]): boolean {
		return (
			(obj?.Telefono === undefined || isValidString(obj.Telefono, 25)) &&
			(obj?.IdTransaccion === undefined || isValidString(obj.IdTransaccion, 200)) &&
			(obj?.Nombre === undefined || isValidString(obj.Nombre, 70)) &&
			(obj?.Apellido === undefined || isValidString(obj.Apellido, 50)) &&
			(obj?.Email === undefined || isValidString(obj.Email, 300))
		);
	}

	// Valida los parámetros de URL (por ejemplo /:Telefono)
	public override isParam(obj: Request["params"]): boolean {
		return (
			obj?.Telefono !== undefined &&
			typeof obj.Telefono === "string" &&
			isValidString(obj.Telefono, 25)
		);
	}

	// Valida si se envía un arreglo de IDs (para eliminar varios beneficiarios)
	public override isBodyIds(obj: Request["body"]): boolean {
		return (
			obj?.Telefonos !== undefined &&
			Array.isArray(obj.Telefonos) &&
			obj.Telefonos.every((t: unknown) => typeof t === "string" && isValidString(t, 25))
		);
	}

	// Convierte los filtros de query a un objeto Beneficiario (para DB)
	public override getFiltrosQuery(obj: Request["query"]): Partial<Beneficiario> {
		const filtros: Partial<Beneficiario> = {};

		if (obj?.Telefono !== undefined) filtros.Telefono = String(obj.Telefono);
		if (obj?.IdTransaccion !== undefined) filtros.IdTransaccion = String(obj.IdTransaccion);
		if (obj?.Nombre !== undefined) filtros.Nombre = String(obj.Nombre);
		if (obj?.Apellido !== undefined) filtros.Apellido = String(obj.Apellido);
		if (obj?.Email !== undefined) filtros.Email = String(obj.Email);

		// (En caso de agregar campos booleanos, usar toBoolStrict aquí)


		return filtros;
	}
}
