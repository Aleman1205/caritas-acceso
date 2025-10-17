import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import { defaultServicio, type Servicio } from "../types/db/servicio.js";
import type ServicioController from "../controllers/servicio.js";
import ServicioValidador from "../utils/validadores/requests/servicio.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";

export default class ServicioHttpHandler extends BaseHttpHandler<Servicio, number> {
    constructor(readonly controller: ServicioController, readonly validadorRequest: ServicioValidador) {
        super(controller, validadorRequest);
    }

	protected override parseKey(params: Request["params"]): number | null {
		return params?.Id !== undefined ? Number(params.Id) : null;
	}

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) {
                throw new Error("Formato del body no válido.");
            }
            const servicio: Servicio = withDefaults<Servicio>(req.body, defaultServicio);
            const exitoso = await this.controller.create(servicio);
            res.json({ exitoso });
        } catch (error) {
            next(error);
        }
    }
}