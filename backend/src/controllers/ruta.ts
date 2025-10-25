import type RutaDbService from "../db/ruta.js";
import type { Ruta } from "../types/db/ruta.js";
import { isPrimitiveKey } from "../types/key.js";
import BaseController from "./base.js";

export default class RutaController extends BaseController<Ruta, { IdSedeServicio: number, Orden: number }> {
  constructor(readonly rutaDbService: RutaDbService) {
    super(rutaDbService);
  }

  
  public override async create(ruta: Ruta): Promise<boolean> {
    return await this.rutaDbService.create(ruta);
  }

  // Crear varias paradas a la vez
  public async createMany(idSedeServicio: number, rutas: Ruta[]): Promise<boolean> {
    return await this.rutaDbService.createMany(idSedeServicio, rutas);
  }

  // Reemplazar toda la ruta de un servicio (borra todo y vuelve a insertar)
  public async replaceRuta(
    idSedeServicio: number,
    paradas: Omit<Ruta, "IdSedeServicio">[]
  ): Promise<boolean> {
    return await this.rutaDbService.replaceRuta(idSedeServicio, paradas);
  }

  // Sincronizar la ruta de un servicio (update/insert/delete según diferencias)
  public async syncRuta(
    idSedeServicio: number,
    paradas: Omit<Ruta, "IdSedeServicio">[]
  ): Promise<boolean> {
    return await this.rutaDbService.syncRuta(idSedeServicio, paradas);
  }
}