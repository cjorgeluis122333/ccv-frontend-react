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

export interface FamilyMember {
    ind: number;
    acc: number;
    nombre: string;
    cedula: number;
    carnet: string;
    celular: string;
    nacimiento: string;
    direccion: string;
    categoria: string;
    telefono?: string;
    correo?: string;
    ingreso?: string;
    ocupacion?: string;
    cobrador?: number;
}

export interface FamilyResponse {
    status: string;
    message: string | null;
    data: FamilyMember[];
}