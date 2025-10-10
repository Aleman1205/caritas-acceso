export interface Beneficiario {
    Telefono: string;
    IdTransaccion?: string;
    Nombre?: string;
    Apellido?: string;
    Email?: string | null;
}

export const defaultBeneficiario: Beneficiario = {
    Telefono: "",
    IdTransaccion: "",
    Nombre: "",
    Apellido: "",
    Email: null
};
