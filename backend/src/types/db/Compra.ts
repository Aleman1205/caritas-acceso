export interface Compra {
    IdTransaccion: string
    Total: number
    Fecha: string | Date
    IdSede: number
    IdServicio: number
}

export const defaultCompra: Compra = {
    IdTransaccion: "",
    Total: 0,
    Fecha: "",
    IdSede: 0,
    IdServicio: 0
};