export default interface Compra {
  IdTransaccion: string;
  Total: number;
  Fecha: Date;
  IdSede: number;
  IdServicio: number;
}

export const defaultCompra: Compra = {
  IdTransaccion: "",
  Total: 0,
  Fecha: new Date(),
  IdSede: 0,
  IdServicio: 0,
};
