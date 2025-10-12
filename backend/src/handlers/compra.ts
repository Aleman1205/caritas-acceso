import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Compra } from "../types/db/Compra.js";
import { defaultCompra } from "../types/db/Compra.js";
import type CompraController from "../controllers/compra.js";
import CompraValidador from "../utils/validadores/requests/compra.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";


export default class CompraHttpHandler extends BaseHttpHandler<Compra, string> {
    constructor(readonly controller: CompraController, readonly validadorRequest: CompraValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): string | null {
        return params?.Id ?? null;
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const compra: Compra = withDefaults<Compra>(req.body, defaultCompra);
            if (typeof compra.Fecha === "string") compra.Fecha = new Date(compra.Fecha);
            const exitoso = await this.controller.create(compra);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }
    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = this.parseKey(req.params);
        if (!id) {
            res.status(400).json({ message: "IdTransaccion no proporcionado" });
            return;
        }

        const compra = await this.controller.getById(id); // <-- Necesita existir en el controller
        if (!compra) {
            res.status(404).json({ message: "Compra no encontrada" });
            return;
        }

        res.json(compra);
    } catch (error) {
        next(error);
    }
    }

}
