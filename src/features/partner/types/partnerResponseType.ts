export interface Partner {
    acc: number;
    nombre: string;
    cedula: number;
    telefono: string;
    correo: string | null;
    nacimiento: string;
    carnet?: string;
    celular?: string;
    direccion?: string;
    ingreso?: string;
    ocupacion?: string;
    categoria?: string;
    cobrador?: string;
}

export interface PartnerQueryParams {
    page?: number;
    per_page?: number;
}