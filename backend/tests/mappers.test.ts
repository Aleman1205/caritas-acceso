import { mapQueryToSedeDTO } from "../src/utils/mappers";

describe("mapQueryToSedeDTO", () => {
  it("convierte Id string a number", () => {
    const dto = mapQueryToSedeDTO({ Id: "42", Nombre: "N" });
    expect(dto).toEqual({ Id: 42, Nombre: "N" });
  });

  it("ignora Id no numérico", () => {
    const dto = mapQueryToSedeDTO({ Id: "abc", Nombre: "X" });
    expect(dto).toEqual({ Nombre: "X" });
  });

  it("no agrega claves ausentes", () => {
    const dto = mapQueryToSedeDTO({});
    expect(dto).toEqual({});
  });
});