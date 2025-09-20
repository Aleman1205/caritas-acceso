import type { Request, Response, NextFunction } from "express";
import SedeController from "../controllers/sede.js";
import withDefaults from "../utils/filler.js";
import { defaultSede, type Sede } from "../types/db/Sede.js";
import BaseHttpHandler from "./base.js";
import SedeValidadorRequest from "../utils/validadores/requests/sede.js";

export default class SedeHttpHandler extends BaseHttpHandler<Sede> {
	constructor(readonly controller: SedeController, readonly validadorRequest: SedeValidadorRequest) {
		super(controller, validadorRequest);
	}

	public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body)) {
				throw new Error("Formato del body no válido.");
			}
			const sede: Sede = withDefaults<Sede>(req.body, defaultSede);
			const exitoso = await this.controller.create(sede);
			res.json({ exitoso });
		} catch (error) {
			next(error);
		}
	}
}