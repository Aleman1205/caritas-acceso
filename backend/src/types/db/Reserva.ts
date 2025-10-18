export interface Reserva {
    IdTransaccion: string;
    FechaInicio: string;     // formato ISO 'YYYY-MM-DD HH:mm:ss'
    FechaSalida: string;     // formato ISO 'YYYY-MM-DD HH:mm:ss'
    NumeroHombres: number;
    NumeroMujeres: number;
    IdSede: number;
}

export const defaultReserva: Reserva = {
    IdTransaccion: "",
    FechaInicio: "",
    FechaSalida: "",
    NumeroHombres: 0,
    NumeroMujeres: 0,
    IdSede: 0
};
