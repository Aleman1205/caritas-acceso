import { isSedeBody, isSedeQuery, isSedeParam, isSedeBodyIds } from "../src/types/validadores/requests/sede";

describe("Validadores Sede", () => {
    it("isSedeBody válido", () => {
    expect(isSedeBody({
        Nombre: "Sede",
        Ubicacion: "Calle",
        Ciudad: "X",
        HoraInicio: "08:00:00",
        HoraFinal: "18:00:00"
    } as any)).toBe(true);
    });

    it("isSedeQuery válido con Id numérico en string", () => {
        expect(isSedeQuery({ id: "10" })).toBe(true);
    });

    it("isSedeParam válido con string numérico", () => {
        expect(isSedeParam({ id: "5" })).toBe(true);
    });

    it("isSedeBodyIds válido con array de enteros", () => {
        expect(isSedeBodyIds({ Ids: [1, 2, 3] })).toBe(true);
    });
});