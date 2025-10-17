export interface Ruta {
    IdSedeServicio?: number;
    Orden: number;
    Hora: string;
    IdParada: number;
};

export const defaultRutaCompleta: Ruta[] = 
[
    {
        Orden: 1,
        Hora: "",
        IdParada: 1
    }
];