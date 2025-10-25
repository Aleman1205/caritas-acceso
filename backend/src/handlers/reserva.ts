import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Reserva } from "../types/db/reserva.js";
import type ReservaController from "../controllers/reserva.js";
import ReservaValidador from "../utils/validadores/requests/reserva.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";

export default class ReservaHttpHandler extends BaseHttpHandler<Reserva, string> {
	constructor(
		readonly controller: ReservaController,
		readonly validadorRequest: ReservaValidador
	) {
		super(controller, validadorRequest);
	}

	// Determina la clave principal del registro (IdTransaccion)
	protected override parseKey(params: Request["params"]): string | null {
		return params?.IdTransaccion !== undefined ? String(params.IdTransaccion) : null;
	}

	// Crea una nueva reserva
	public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body))
				throw new Error("Formato del body no válido.");

			// ✅ Si no existe defaultReserva, simplemente pasa el body directamente
			const reserva: Reserva = withDefaults<Reserva>(req.body, {} as Reserva);

			const exitoso = await this.controller.create(reserva);
			res.json({ exitoso });
		} catch (error) {
			next(error);
		}
	}

	// Obtiene una reserva por su IdTransaccion
	public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { IdTransaccion } = req.params;
			if (typeof IdTransaccion !== "string")
				throw new Error("Parámetro IdTransaccion inválido.");

			const result = await this.controller.obtenerPorTransaccion(IdTransaccion);
			if (!result) {
				res.status(404).json({ mensaje: "Reserva no encontrada." });
				return;
			}

			res.json(result);
		} catch (error) {
			next(error);
		}
	}

	// Elimina una reserva por IdTransaccion + IdSede
	public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { IdTransaccion, IdSede } = req.params;
			if (!IdTransaccion || !IdSede)
				throw new Error("Faltan parámetros: IdTransaccion o IdSede.");

			const eliminado = await this.controller.eliminar(IdTransaccion, Number(IdSede));
			res.json({ eliminado });
		} catch (error) {
			next(error);
		}
	}
}
