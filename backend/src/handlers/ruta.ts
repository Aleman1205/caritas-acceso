import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Ruta } from "../types/db/ruta.js";
import type RutaController from "../controllers/ruta.js";
import RutaValidador from "../utils/validadores/requests/ruta.js";


export default class RutaHttpHandler extends BaseHttpHandler<Ruta, { IdSedeServicio: number, Orden: number }> {
    constructor(readonly controller: RutaController, readonly validadorRequest: RutaValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): { IdSedeServicio: number }  | null {
        return params?.IdSedeServicio !== undefined ? { IdSedeServicio: Number(params?.IdSedeServicio) } : null;
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const ruta: Ruta[] = req.body.Rutas;
            const exitoso = await this.controller.createMany(req.body.IdSedeServicio, ruta);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }

    public async replaceRuta(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const ruta: Ruta[] = req.body.Rutas;
            const exitoso = await this.controller.replaceRuta(req.body.IdSedeServicio, ruta);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }

    public async syncRuta(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const ruta: Ruta[] = req.body.Rutas;
            const exitoso = await this.controller.syncRuta(req.body.IdSedeServicio, ruta);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }
}