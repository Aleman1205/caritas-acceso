export interface Usuario {
    Email: string
    Telefono?: string | null
    Nombre?: string | null
    Apellido?: string | null
    FotoUrl?: string | null
    FechaNacimiento?: string | Date
    IdTipoUsuario?: number | null
}

export const defaultUsuario: Usuario = {
    Email: "",
    Telefono: "",
    Nombre: "",
    Apellido: "",
    FotoUrl: "",
    FechaNacimiento: "",
    IdTipoUsuario: 1
};