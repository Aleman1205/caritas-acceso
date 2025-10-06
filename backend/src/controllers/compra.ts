import type CompraDbService from "../db/compra.js";
import type { Compra } from "../types/db/compra.js";
import BaseController from "./base.js";

export default class CompraController extends BaseController<Compra, string > {
    constructor(readonly compraDbService: CompraDbService) {
        super(compraDbService);
    }

    public override async create(compra: Compra): Promise<boolean> {
        return await this.compraDbService.create(compra);
    }
}
