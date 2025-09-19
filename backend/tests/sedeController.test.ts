import SedeController from "../src/controllers/sede";
import type SedeDbService from "../src/db/sede";
import type { SedeDTO, Sede } from "../src/types/db/Sede";

describe("SedeController", () => {
    let service: jest.Mocked<SedeDbService>;
    let controller: SedeController;

    beforeEach(() => {
    service = {
        createSede: jest.fn<Promise<boolean>, [SedeDTO]>(),
        getSedes: jest.fn<Promise<Sede[]>, [Partial<SedeDTO> | undefined]>(),
        updateSede: jest.fn<Promise<boolean>, [number, Partial<SedeDTO>]>(),
        deleteSedes: jest.fn<Promise<number>, [number[]]>(),
        db: {} as any, // constructor
    } as unknown as jest.Mocked<SedeDbService>;
        controller = new SedeController(service);
    });

    it("crearSede delega al service", async () => {
        service.createSede.mockResolvedValue(true);
        const ok = await controller.crearSede({
            Nombre: "Sede",
            Ubicacion: "U",
            Ciudad: "C",
            HoraInicio: "08:00:00",
            HoraFinal: "18:00:00"
        });
        expect(ok).toBe(true);
    });

    it("getSedes incluye Id cuando se pasa", async () => {
        service.getSedes.mockResolvedValue([{ Id: 1 }] as any);
        const result = await controller.getSedes(1, { Nombre: "X" });
        expect(result).toEqual([{ Id: 1 }]);
        expect(service.getSedes).toHaveBeenCalledWith({ Id: 1, Nombre: "X" });
    });

    it("updateSede delega correctamente", async () => {
        service.updateSede.mockResolvedValue(true);
        const ok = await controller.updateSede(1, { Nombre: "Nuevo" });
        expect(ok).toBe(true);
    });

    it("deleteSedes retorna cantidad eliminada", async () => {
        service.deleteSedes.mockResolvedValue(2);
        const count = await controller.deleteSedes([1, 2]);
        expect(count).toBe(2);
    });
});
