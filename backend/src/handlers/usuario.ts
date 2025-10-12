import type { Request, Response, NextFunction } from "express";
import BaseHttpHandler from "./base.js";
import type { Usuario } from "../types/db/Usuario.js";
import { defaultUsuario } from "../types/db/Usuario.js";
import type UsuarioController from "../controllers/usuario.js";
import UsuarioValidador from "../utils/validadores/requests/usuario.js";
import withDefaults from "../utils/functions/withDefaultsFiller.js";


export default class UsuarioHttpHandler extends BaseHttpHandler<Usuario, string> {
    constructor(readonly controller: UsuarioController, readonly validadorRequest: UsuarioValidador) {
        super(controller, validadorRequest);
    }

    protected override parseKey(params: Request["params"]): string | null {
        return params?.Email ?? null;
    }

    public override async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!this.validadorRequest.isBody(req.body)) throw new Error("Formato del body no válido.");
            const usuario: Usuario = withDefaults<Usuario>(req.body, defaultUsuario);
            const exitoso = await this.controller.create(usuario);
            res.json({ exitoso });
        } catch (error) { next(error); }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const email = this.parseKey(req.params);
        if (!email) {
            res.status(400).json({ message: "Email no proporcionado" });
            return;
        }

        const usuario = await this.controller.getById(email); // <-- Necesita existir en el controller
        if (!usuario) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.json(usuario);
    } catch (error) {
        next(error);
        }
    }

}

