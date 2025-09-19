import type SedeDbService from "../db/sede.js";
import type { Sede, SedeDTO } from "../types/db/Sede.js";

export default class SedeController {
	constructor(private sedeDbService: SedeDbService) {}

	public async crearSede(sede: SedeDTO): Promise<boolean> {
		return this.sedeDbService.createSede(sede);
	}

	public async getSedes(id: number | null, datos: Partial<SedeDTO>): Promise<Sede[]> {
		const filtros = id !== null ? { Id: id, ...datos } : datos;
		return this.sedeDbService.getSedes(filtros);
	}

	public async updateSede(id: number, cambios: Partial<SedeDTO>): Promise<boolean> {
		return this.sedeDbService.updateSede(id, cambios);
	}

	public async deleteSedes(ids: number[]): Promise<number> {
		return this.sedeDbService.deleteSedes(ids);
	}
}