import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Parada } from "../types/db/parada.js";
import { defaultParada } from "../types/db/parada.js";
import type ParadaController from "../controllers/parada.js";
import ParadaValidador from "../utils/validadores/requests/parada.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";


export default class ParadaHttpHandler extends BaseHttpHandler<Parada, number> {
    constructor(readonly controller: ParadaController, readonly validadorRequest: ParadaValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): number | null {
        return params?.Id !== undefined ? Number(params.Id) : null;
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const parada: Parada = withDefaults<Parada>(req.body, defaultParada);
            const exitoso = await this.controller.create(parada);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }
}