import type CompraDbService from "../db/compra.js";
import type Compra from "../types/db/compra.js";
import BaseController from "./base.js";

export default class CompraController extends BaseController<Compra, string> {
	constructor(readonly compraDbService: CompraDbService) {
		super(compraDbService);
	}

	// Crear una nueva compra
	public override async create(compra: Compra): Promise<boolean> {
		return await this.compraDbService.create(compra);
	}

	// ✅ Obtener una compra por IdTransaccion
	public async getById(id: string): Promise<Compra | null> {
		return await this.compraDbService.getById(id);
	}
}
