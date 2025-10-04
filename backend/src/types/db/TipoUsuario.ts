export interface TipoUsuario {
    Id: number
    Descripcion: string | null
}

export const defaultTipoUsuario: TipoUsuario = {
    Id: 1,
    Descripcion: null
};
