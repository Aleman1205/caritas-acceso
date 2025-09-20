import type ServicioDbService from "../db/servicio.js";
import type { Servicio } from "../types/db/Servicio.js";
import BaseController from "./base.js";

export default class ServicioController extends BaseController<Servicio> {
    constructor(readonly servicioDbService: ServicioDbService) {
        super(servicioDbService);
    }

    public override async create(servicio: Servicio): Promise<boolean> {
        return this.servicioDbService.create(servicio);
    }
}