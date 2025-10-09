export interface Reserva {
    IdTransaccion: string;
    FechaInicio: string;     // formato ISO 'YYYY-MM-DD HH:mm:ss'
    FechaSalida: string;     // formato ISO 'YYYY-MM-DD HH:mm:ss'
    NumeroPersonas: number;
    IdSede: number;
}

export const defaultReserva: Reserva = {
    IdTransaccion: "",
    FechaInicio: "",
    FechaSalida: "",
    NumeroPersonas: 0,
    IdSede: 0
};
