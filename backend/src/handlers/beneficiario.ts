import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Beneficiario } from "../types/db/beneficiario.js";
import { defaultBeneficiario } from "../types/db/beneficiario.js";
import type BeneficiarioController from "../controllers/beneficiario.js";
import BeneficiarioValidadorRequest from "../utils/validadores/requests/beneficiario.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";

export default class BeneficiarioHttpHandler extends BaseHttpHandler<Beneficiario, string> {
	constructor(
		readonly controller: BeneficiarioController,
		readonly validadorRequest: BeneficiarioValidadorRequest
	) {
		super(controller, validadorRequest);
	}

	// Determina la clave principal del registro
	protected override parseKey(params: Request["params"]): string | null {
		// El identificador principal en Beneficiario es la combinación Teléfono + IdTransaccion.
		return params?.Telefono !== undefined && params?.IdTransaccion !== undefined
			? `${params.Telefono}-${params.IdTransaccion}`
			: null;
	}

	// Crear un nuevo beneficiario
	public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body))
				throw new Error("Formato del body no válido.");

			const beneficiario: Beneficiario = withDefaults<Beneficiario>(
				req.body,
				defaultBeneficiario
			);

			const exitoso = await this.controller.create(beneficiario);
			res.json({ exitoso });
		} catch (error) {
			next(error);
		}
	}

	// Obtener un beneficiario por Telefono + IdTransaccion
	public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { Telefono, IdTransaccion } = req.params;

			if (!Telefono || !IdTransaccion)
				throw new Error("Faltan parámetros: Telefono o IdTransaccion.");

			const result = await this.controller.obtenerPorTransaccion(IdTransaccion);

			// Filtrar el resultado específico del teléfono
			const beneficiario = result && result.Telefono === Telefono ? result : null;

			if (!beneficiario) {
				res.status(404).json({ mensaje: "Beneficiario no encontrado." });
				return;
			}

			res.json(beneficiario);
		} catch (error) {
			next(error);
		}
	}

	// Eliminar un beneficiario por Telefono + IdTransaccion
	public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { Telefono, IdTransaccion } = req.params;
			if (!Telefono || !IdTransaccion)
				throw new Error("Faltan parámetros: Telefono o IdTransaccion.");

			const eliminado = await this.controller.eliminar(Telefono, IdTransaccion);
			res.json({ eliminado });
		} catch (error) {
			next(error);
		}
	}
}
