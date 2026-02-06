export interface Partner {
    acc: number;
    nombre: string;
    cedula: number;
    telefono: string;
    correo: string | null;
    nacimiento: string;
}

export interface PartnerQueryParams {
    page?: number;
    per_page?: number;
}