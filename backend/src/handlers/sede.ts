import type { Request, Response, NextFunction } from "express";
import SedeController from "../controllers/sede.js";
import { isSedeBody, isSedeQuery, isSedeParam, isSedeBodyIds } from "../types/validadores/requests/sede.js";
import withDefaults from "./filler.js";
import { defaultSede, type SedeDTO } from "../types/db/Sede.js";
import { mapQueryToSedeDTO } from "../utils/mappers.js";

export class SedeHttpHandler {
	constructor(private controller: SedeController) {}

	public async crearSede(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!isSedeBody(req.body)) {
				throw new Error("Formato del body no válido.");
			}
			const sede: SedeDTO = withDefaults<SedeDTO>(req.body, defaultSede);
			const exitoso = await this.controller.crearSede(sede);
			res.json({ exitoso });
		} catch (error) {
			next(error);
		}
	}

	// GET /sedes o GET /sedes/:id
    public async getSede(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!isSedeQuery(req.query)) {
                throw new Error("Formato de query no válido.");
            }
            if (req.params.id !== undefined && !isSedeParam(req.params)) {
                throw new Error("Formato de params no válido.");
            }

            const id: number | null = req.params.id ? Number(req.params.id) : null;
            const filtros: Partial<SedeDTO> = mapQueryToSedeDTO(req.query);

            const sedes = await this.controller.getSedes(id, filtros);
            res.json({ sedes });
        } catch (error) {
            next(error);
        }
    }

	// PUT /sedes/:id
	public async updateSede(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!isSedeBody(req.body)) {
				throw new Error("Formato del body no válido.");
			}
			if (!isSedeParam(req.params)) {
				throw new Error("Formato de params no válido.");
			}

			const id = Number(req.params.id);
			const cambios: Partial<SedeDTO> = req.body; // para evitar defaults en update
			const respuesta = await this.controller.updateSede(id, cambios);
			res.json({ respuesta });
		} catch (error) {
			next(error);
		}
	}

	// DELETE /sedes
	public async deleteSedes(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!isSedeBodyIds(req.body)) {
				throw new Error("Formato del body no válido.");
			}
			const ids: number[] = req.body.Ids;
			const respuesta = await this.controller.deleteSedes(ids);
			res.json({ respuesta });
		} catch (error) {
			next(error);
		}
	}
}