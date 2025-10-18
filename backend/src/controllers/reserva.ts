import type { Reserva } from "../types/db/Reserva.js";
import BaseController from "./base.js";
import ReservaDbService from "../db/reserva.js";

export default class ReservaController extends BaseController<Reserva, string> {
	constructor(readonly reservaDbService: ReservaDbService) {
		super(reservaDbService);
	}

	// Crear reserva
	public override async create(reserva: Reserva): Promise<boolean> {
		return await this.reservaDbService.create(reserva);
	}

	// Obtener por IdTransaccion
	public async obtenerPorTransaccion(idTransaccion: string): Promise<Reserva | null> {
		const resultados = await this.reservaDbService.getMany({
			IdTransaccion: idTransaccion,
		});
		return resultados[0] ?? null;
	}

	// Eliminar por IdTransaccion + IdSede
	public async eliminar(idTransaccion: string, idSede: number): Promise<boolean> {
		return await this.reservaDbService.delete({
			IdTransaccion: idTransaccion,
			IdSede: idSede,
		});
	}
}
