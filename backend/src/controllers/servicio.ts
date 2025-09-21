import type BaseDbService from "../db/base.js";
import type { Servicio } from "../types/db/Servicio.js";
import BaseController from "./base.js";

export default class ServicioController extends BaseController<Servicio, number> {
    constructor(readonly servicioDbService: BaseDbService<Servicio, number>) {
        super(servicioDbService);
    }

    public override async create(servicio: Servicio): Promise<boolean> {
        return await this.servicioDbService.create(servicio);
    }
}