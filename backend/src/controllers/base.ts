import type BaseDbService from "../db/base.js";
import type { Key } from "../types/key.js";
import { isPrimitiveKey } from "../types/key.js";

export default abstract class BaseController<T, K extends Key = number> {
    constructor(protected dbService: BaseDbService<T, K>) {}

    public abstract create(objeto: T): Promise<boolean>;

    public async getAll(id: K | null, datos: Partial<T>): Promise<T[]> {
        let filtros: Partial<T> = datos || {};
        if (id !== null && id !== undefined) {
            filtros = isPrimitiveKey(id)
                ? ({ Id: id, ...filtros } as Partial<T>)
                : ({ ...(id as object), ...filtros } as Partial<T>);
        }
        return await this.dbService.getAll(filtros);
    }

    public async update(id: K, cambios: Partial<T>): Promise<boolean> {
        return await this.dbService.update(id, cambios);
    }

    public async deleteMany(ids: K[]): Promise<number> {
        return await this.dbService.deleteMany(ids);
    }
}