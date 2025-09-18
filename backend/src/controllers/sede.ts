import type { Request, Response } from "express";
import SedeDbService from "../db/sede.js"
import type { Sede, SedeDTO } from "../types/db/Sede.ts"
import mapSedeQuery from "./mappers/sede.js";

export default class SedeController {
    constructor(
        private sedeDbService: SedeDbService
    ) {}

    public async crearSede(req: Request, res: Response): Promise<Response> {
        const sede: SedeDTO = { 
            Ubicacion: String(req.body.Ubicacion),
            HoraInicio: String(req.body.HoraInicio),
            HoraFinal: String(req.body.HoraFinal),
            Descripcion: String(req.body.Descripcion)
        };
        try {
            const respuesta: boolean = await this.sedeDbService.createSede(sede);
            return res.json(respuesta);
        } catch (err) {
            return res.status(500).json({ error: "Error al crear sede" });
        }
    }


    public async getSede(req: Request, res: Response): Promise<Response> {
        try {
            const filtros: Partial<Sede> = mapSedeQuery(req.query);
            const sedes: Sede[] = await this.sedeDbService.getSedes(filtros);
            return res.json(sedes);
        } catch (err) {
            return res.status(500).json({ error: "Error al obtener sedes" });
        }
    }

    public async updateSede(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = Number(req.query.id);
            delete req.query.id;
            const filtros: Partial<Sede> = mapSedeQuery(req.query);
            const respuesta: boolean = await this.sedeDbService.updateSede(id, filtros);
            return res.json(respuesta);
        } catch (err) {
            return res.status(500).json({ error: "Error al actualizar sede" });
        }
    }

    public async deleteSede(req: Request, res: Response): Promise<Response> {
        try {
            const filtros: Partial<Sede> = mapSedeQuery(req.query);
            const respuesta: boolean = await this.sedeDbService.deleteSede(filtros);
            return res.json(respuesta);
        } catch (err) {
            return res.status(500).json({ error: "Error al eliminar sede" });
        }
    }

}