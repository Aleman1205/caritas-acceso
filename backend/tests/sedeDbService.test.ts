import SedeDbService from "../src/db/sede.js";
import type { Pool } from "mysql2/promise";

describe("SedeDbService", () => {
    let db: jest.Mocked<Pick<Pool, "query">>;
    let service: SedeDbService;

    beforeEach(() => {
        db = { query: jest.fn() };
        service = new SedeDbService(db as unknown as Pool);
    });

    it("createSede inserta y retorna true", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 } as any, []]);
        const ok = await service.createSede({
            Nombre: "Sede 1",
            Ubicacion: "Calle 123",
            Ciudad: "Madrid",
            HoraInicio: "08:00:00",
            HoraFinal: "18:00:00",
            Descripcion: "Centro"
        });
        expect(ok).toBe(true);
    });

    it("getSedes sin filtros arma SELECT simple", async () => {
        const rows = [{ Id: 1, Nombre: "Sede 1" }];
        db.query.mockResolvedValueOnce([rows as any, []]);
        const result = await service.getSedes();
        expect(result).toEqual(rows);
    });

    it("updateSede actualiza y retorna true", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 1 } as any, []]);
        const ok = await service.updateSede(1, { Nombre: "Nuevo" });
        expect(ok).toBe(true);
    });

    it("deleteSedes borra ids válidos", async () => {
        db.query.mockResolvedValueOnce([{ affectedRows: 2 } as any, []]);
        const count = await service.deleteSedes([1, 2]);
        expect(count).toBe(2);
    });
});