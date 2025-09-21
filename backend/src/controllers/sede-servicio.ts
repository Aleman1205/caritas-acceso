import type SedeServicioDbService from "../db/sede-servicio.js";
import type { SedeServicio } from "../types/db/SedeServicio.js";
import BaseController from "./base.js";

export default class SedeServicioController extends BaseController<SedeServicio, { IdSede: number, IdServicio: number }> {
    constructor(readonly sedeServicioDbService: SedeServicioDbService) {
        super(sedeServicioDbService);
    }

    public override async create(sedeServicio: SedeServicio): Promise<boolean> {
        return await this.sedeServicioDbService.create(sedeServicio);
    }
}