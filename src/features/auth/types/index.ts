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

// Respuesta de Login
export interface LoginResponse {
    status: string;
    access_token: string;
    token_type: string;
    user: User;
    socio_info: SocioInfo;
}

// Respuesta de Registro
export interface RegisterResponse {
    status: string;
    message: string;
    access_token: string;
    user: User;
    member_details: SocioInfo; // Nota: Tu API devuelve nombres distintos (socio_info vs member_details)
}

// Tipos para los formularios (Inputs)
export interface LoginCredentials {
    acc: string; // Lo manejamos como string en el input, aunque se envíe número
    password: string;
}

export interface RegisterCredentials {
    acc: number;
    cedula: number;
    correo: string;
    password: string;
    password_confirmation: string;
}