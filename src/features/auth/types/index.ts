// Definición del Usuario base
export interface User {
    id: number;
    acc: number;
    cedula: number;
    correo: string;
    created_at: string;
    updated_at: string;
}

// Definición de la información del socio (Normalizamos socio_info y member_details)
export interface SocioInfo {
    ind: number;
    sincro: number;
    acc: number;
    cedula: number;
    carnet: string;
    nombre: string;
    celular: string;
    telefono: string;
    correo: string;
    direccion: string;
    nacimiento: string;
    ingreso: string;
    ocupacion: string;
    categoria: string;
    cobrador: number;
}
