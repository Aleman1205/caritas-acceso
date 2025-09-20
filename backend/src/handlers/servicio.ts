import type { Request, Response, NextFunction } from "express";
import ServicioController from "../controllers/servicio.js";
import withDefaults from "../utils/filler.js";
import { defaultServicio, type Servicio } from "../types/db/Servicio.js";
import BaseHttpHandler from "./base.js";
import ServicioValidadorRequest from "../utils/validadores/requests/servicio.js";

export default class ServicioHttpHandler extends BaseHttpHandler<Servicio> {
    constructor(readonly controller: ServicioController, readonly validadorRequest: ServicioValidadorRequest) {
        super(controller, validadorRequest);
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) {
                throw new Error("Formato del body no válido.");
            }
            const sede: Servicio = withDefaults<Servicio>(req.body, defaultServicio);
            const exitoso = await this.controller.create(sede);
            res.json({ exitoso });
        } catch (error) {
            next(error);
        }
    }
}