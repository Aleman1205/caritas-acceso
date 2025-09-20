import type SedeDbService from "../db/sede.js";
import type { Sede } from "../types/db/Sede.js";
import BaseController from "./base.js";

export default class SedeController extends BaseController<Sede> {
	constructor(readonly sedeDbService: SedeDbService) {
		super(sedeDbService);
	}

	public override async create(sede: Sede): Promise<boolean> {
		return this.sedeDbService.create(sede);
	}
}