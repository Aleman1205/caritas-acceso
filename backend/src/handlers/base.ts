import type { Request, Response, NextFunction } from "express";
import type { Key } from "../types/key.js";
import BaseController from "../controllers/base.js";

export type Validator<T> = {
	isBody(obj: Request["body"]): boolean;
	isQuery(obj: Request["query"]): boolean;
	getFiltrosQuery(obj: Request["query"]): Partial<T>;
	isParam(obj: Request["params"]): boolean; // cada hijo puede implementarlo a su manera
	isBodyIds?(obj: Request["body"]): boolean; // para simple: { Ids: number[] }
	isBodyKeys?(obj: Request["body"]): boolean; // para compuesta: { Keys: K[] }
};

export default abstract class BaseHttpHandler<
	T extends object,
	K extends Key = number
> {
	constructor(
		protected controller: BaseController<T, K>,
		protected validadorRequest: Validator<T>
	) {}

	protected abstract parseKey(
		params: Request["params"]
	): K | Partial<K> | null;
	public abstract create(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void>;

	// ✅ GET /:id — obtiene un registro por ID
	public async getById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!this.validadorRequest.isParam(req.params)) {
				throw new Error("Formato de params no válido.");
			}

			const id = this.parseKey(req.params);
			if (id === null) throw new Error("Llave requerida en params.");

			// ✅ corrección: tipado seguro
			const data = await this.controller.getById(id as K);

			if (!data) {
				res.status(404).json({ mensaje: "Registro no encontrado." });
				return;
			}

			res.json(data);
		} catch (error) {
			next(error);
		}
	}

	// ✅ GET con filtros (para obtener varios registros)
	public async getAll(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!this.validadorRequest.isQuery(req.query))
				throw new Error("Formato de query no válido.");
			if (
				Object.keys(req.params || {}).length > 0 &&
				!this.validadorRequest.isParam(req.params)
			) {
				throw new Error("Formato de params no válido.");
			}

			const id = this.parseKey(req.params);
			const filtros = this.validadorRequest.getFiltrosQuery(req.query);
			const data = await this.controller.getAll(id, filtros);

			res.json({ data });
		} catch (error) {
			next(error);
		}
	}

	// ✅ PUT — actualiza un registro
	public async update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!this.validadorRequest.isBody(req.body))
				throw new Error("Formato del body no válido.");
			if (!this.validadorRequest.isParam(req.params))
				throw new Error("Formato de params no válido.");

			const id = this.parseKey(req.params);
			if (id === null) throw new Error("Llave requerida en params.");

			const cambios: Partial<T> = req.body;
			const respuesta = await this.controller.update(id, cambios);

			res.json({ respuesta });
		} catch (error) {
			next(error);
		}
	}

	// ✅ DELETE — elimina varios registros (Ids[] o Keys[])
	public async deleteMany(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			let ids: K[] | null = null;

			if (this.validadorRequest.isBodyIds?.(req.body)) {
				ids = req.body.Ids as K[];
			} else if (this.validadorRequest.isBodyKeys?.(req.body)) {
				ids = req.body.Keys as K[];
			}

			if (!ids || ids.length === 0)
				throw new Error("Formato del body no válido (Ids[] o Keys[]).");

			const respuesta = await this.controller.deleteMany(ids);
			res.json({ respuesta });
		} catch (error) {
			next(error);
		}
	}
}
