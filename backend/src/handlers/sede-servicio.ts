import type { Request, Response, NextFunction } from "express";
import type SedeServicioController from "../controllers/sede-servicio.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";
import { defaultSedeServicio, type SedeServicio } from "../types/db/SedeServicio.js";
import BaseHttpHandler from "./base.js";
import type SedeServicioValidador from "../utils/validadores/requests/sede-servicio.js";

export default class SedeServicioHttpHandler extends BaseHttpHandler<SedeServicio, { IdSede: number, IdServicio: number }> {
    constructor(readonly controller: SedeServicioController, readonly validadorRequest: SedeServicioValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): { IdSede: number, IdServicio: number } | null {
		return params?.IdSede !== undefined && params?.IdServicio !== undefined ? { IdSede: Number(params?.IdSede), IdServicio: Number(params?.IdServicio) } : null;
	}

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) {
                throw new Error("Formato del body no válido.");
            }
            const sedeServicio: SedeServicio = withDefaults<SedeServicio>(req.body, defaultSedeServicio);
            const exitoso = await this.controller.create(sedeServicio);
            res.json({ exitoso });
        } catch (error) {
            next(error);
        }
    }
}