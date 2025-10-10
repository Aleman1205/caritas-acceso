import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type {Beneficiario} from "../types/db/Beneficiario.js";
import { defaultBeneficiario } from "../types/db/Beneficiario.js";
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
		// El identificador principal en Beneficiario es el teléfono o la combinación Telefono + IdTransaccion.
		return params?.Telefono !== undefined ? String(params.Telefono) : null;
	}

	// rea un nuevo beneficiario
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

	// Obtiene un beneficiario por su IdTransaccion
	public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { IdTransaccion } = req.params;
			if (typeof IdTransaccion !== "string") throw new Error("Parámetro IdTransaccion inválido.");

			const result = await this.controller.obtenerPorTransaccion(IdTransaccion);
			if (!result) {
				res.status(404).json({ mensaje: "Beneficiario no encontrado." });
				return;
			}

			res.json(result);
		} catch (error) {
			next(error);
		}
	}

	// Elimina un beneficiario por Telefono + IdTransaccion
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