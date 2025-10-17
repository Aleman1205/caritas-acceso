import type { Beneficiario } from "../types/db/beneficiario.js";
import BaseController from "./base.js";
import BeneficiarioDbService from "../db/beneficiario.js";

export default class BeneficiarioController extends BaseController<Beneficiario, string> {
	constructor(readonly beneficiarioDbService: BeneficiarioDbService) {
		super(beneficiarioDbService);
	}

	// Crear beneficiario
	public override async create(beneficiario: Beneficiario): Promise<boolean> {
		return await this.beneficiarioDbService.create(beneficiario);
	}

	// Obtener por IdTransaccion
	public async obtenerPorTransaccion(idTransaccion: string): Promise<Beneficiario | null> {
		const resultados = await this.beneficiarioDbService.getMany({
			IdTransaccion: idTransaccion,
		});
		return resultados[0] ?? null;
	}

	// Eliminar por Telefono + IdTransaccion
	public async eliminar(telefono: string, idTransaccion: string): Promise<boolean> {
		return await this.beneficiarioDbService.delete({
			Telefono: telefono,
			IdTransaccion: idTransaccion,
		});
	}
}
