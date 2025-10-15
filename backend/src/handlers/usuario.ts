import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type Usuario from "../types/db/Usuario.js";
import type UsuarioController from "../controllers/usuario.js";
import UsuarioValidador from "../utils/validadores/requests/usuario.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";

export default class UsuarioHttpHandler extends BaseHttpHandler<Usuario, string> {
	constructor(
		readonly controller: UsuarioController,
		readonly validadorRequest: UsuarioValidador
	) {
		super(controller, validadorRequest);
	}

	protected override parseKey(params: Request["params"]): string | null {
		return params?.Email ? String(params.Email) : null;
	}

	public override async create(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body)) {
				throw new Error("Formato del body no válido.");
			}

			const usuario: Usuario = withDefaults<Usuario>(req.body, {} as Usuario);
			const exitoso = await this.controller.create(usuario);
			res.json({ exitoso });
		} catch (error) {
			next(error);
		}
	}
}
