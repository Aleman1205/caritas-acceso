import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Sede } from "../types/db/sede.js";
import { defaultSede } from "../types/db/sede.js";
import type SedeController from "../controllers/sede.js";
import SedeValidador from "../utils/validadores/requests/sede.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";

export default class SedeHttpHandler extends BaseHttpHandler<Sede, number> {
	constructor(readonly controller: SedeController, readonly validadorRequest: SedeValidador) {
		super(controller, validadorRequest);
	}

	protected override parseKey(params: Request["params"]): number | null {
		return params?.Id !== undefined ? Number(params.Id) : null;
	}

	public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
			const sede: Sede = withDefaults<Sede>(req.body, defaultSede);
			const exitoso = await this.controller.create(sede);
			res.json({ exitoso });
		} catch (error) { next(error); }
	}
}