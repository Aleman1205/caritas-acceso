import type UsuarioDbService from "../db/usuario.js";
import type { Usuario } from "../types/db/Usuario.js";
import BaseController from "./base.js";

export default class UsuarioController extends BaseController<Usuario, string > {
    constructor(readonly usuarioDbService: UsuarioDbService) {
        super(usuarioDbService);
    }

    public override async create(usuario: Usuario): Promise<boolean> {
        return await this.usuarioDbService.create(usuario);
    }

    public async getById(email: string): Promise<Usuario | null> {
        const registros = await this.usuarioDbService.getAll({ Email: email });
        return registros[0] ?? null;
    }
}
