import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type Compra from "../types/db/compra.js";
import { defaultCompra } from "../types/db/compra.js";
import type CompraController from "../controllers/compra.js";
import CompraValidador from "../utils/validadores/requests/compra.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";


export default class CompraHttpHandler extends BaseHttpHandler<Compra, string> {
    constructor(readonly controller: CompraController, readonly validadorRequest: CompraValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): string | null {
        return params?.IdTransaccion !== undefined ? String(params.IdTransaccion) : null;
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const compra: Compra = withDefaults<Compra>(req.body, defaultCompra);
            const exitoso = await this.controller.create(compra);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }
}
