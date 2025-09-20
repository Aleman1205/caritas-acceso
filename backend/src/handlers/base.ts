import type { Request, Response, NextFunction } from "express";
import BaseController from "../controllers/base.js";
import BaseValidadorRequest from "../utils/validadores/requests/base.js";

export default abstract class BaseHttpHandler<T extends object> {
    constructor(protected controller: BaseController<T>, protected validadorRequest: BaseValidadorRequest<T>) {}

    public abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;

    // GET /<t> o GET /<t>/:Id
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isQuery(req.query)) {
                throw new Error("Formato de query no válido.");
            }
            if (req.params.Id !== undefined && !this.validadorRequest.isParam(req.params)) {
                throw new Error("Formato de params no válido.");
            }

            const id: number | null = req.params.Id ? Number(req.params.Id) : null;
            const filtros: Partial<T> = this.validadorRequest.getFiltrosQuery(req.query);

            const sedes = await this.controller.getAll(id, filtros);
            res.json({ sedes });
        } catch (error) {
            next(error);
        }
    }

    // PUT /sedes/:Id
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) {
                throw new Error("Formato del body no válido.");
            }
            if (!this.validadorRequest.isParam(req.params)) {
                throw new Error("Formato de params no válido.");
            }

            const id = Number(req.params.Id);
            const cambios: Partial<T> = req.body; // para evitar defaults en update
            const respuesta = await this.controller.update(id, cambios);
            res.json({ respuesta });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /sedes
    public async deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBodyIds(req.body)) {
                throw new Error("Formato del body no válido.");
            }
            const ids: number[] = req.body.Ids;
            const respuesta = await this.controller.deleteMany(ids);
            res.json({ respuesta });
        } catch (error) {
            next(error);
        }
    }
}