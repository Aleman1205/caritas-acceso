import type BaseDbService from "../db/base.js";
import type { Parada } from "../types/db/parada.js";
import BaseController from "./base.js";

export default class ParadaController extends BaseController<Parada, number> {
    constructor(readonly paradaDbService: BaseDbService<Parada, number>) {
        super(paradaDbService);
    }

    public override async create(parada: Parada): Promise<boolean> {
        return await this.paradaDbService.create(parada);
    }
}