import type BaseDbService from "../db/base.js";

export default abstract class BaseController<T> {
    constructor(protected dbService: BaseDbService<T>) {}

    public abstract create(objeto: T): Promise<boolean>;

    // Puede obtener uno con el ID unicamente y/o los atributos
    public async getAll(id: number | null, datos: Partial<T>): Promise<T[]> {
        const filtros = id !== null ? { Id: id, ...datos } : datos;
        return this.dbService.getAll(filtros);
    }

    public async update(id: number, cambios: Partial<T>): Promise<boolean> {
        return this.dbService.update(id, cambios);
    }

    public async deleteMany(ids: number[]): Promise<number> {
        return this.dbService.deleteMany(ids);
    }
}