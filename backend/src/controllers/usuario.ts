import type UsuarioDbService from "../db/usuario.js";
import type Usuario from "../types/db/usuario.js";
import BaseController from "./base.js";

export default class UsuarioController extends BaseController<Usuario, string > {
    constructor(readonly usuarioDbService: UsuarioDbService) {
        super(usuarioDbService);
    }

    public override async create(usuario: Usuario): Promise<boolean> {
        return await this.usuarioDbService.create(usuario);
    }
}
