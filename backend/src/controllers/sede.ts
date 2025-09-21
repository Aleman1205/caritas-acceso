import type BaseDbService from "../db/base.js";
import type { Sede } from "../types/db/Sede.js";
import BaseController from "./base.js";

export default class SedeController extends BaseController<Sede, number> {
	constructor(readonly sedeDbService: BaseDbService<Sede, number>) {
		super(sedeDbService);
	}

	public override async create(sede: Sede): Promise<boolean> {
		return await this.sedeDbService.create(sede);
	}
}