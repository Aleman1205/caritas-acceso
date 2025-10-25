export default interface Usuario {
    Email: string
    Telefono?: string | null
    Nombre?: string
    Apellido?: string
    FotoUrl?: string | null
    FechaNacimiento?: Date
    IdTipoUsuario?: number
}