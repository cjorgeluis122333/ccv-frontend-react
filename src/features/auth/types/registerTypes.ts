
// Respuesta de Registro
import type {SocioInfo, User} from "@/features/auth/types/index.ts";

export interface RegisterResponse {
    status: string;
    message: string;
    access_token: string;
    user: User;
    member_details: SocioInfo; // Nota: Tu API devuelve nombres distintos (socio_info vs member_details)
}


export interface RegisterCredentials {
    acc: number;
    cedula: number;
    correo: string;
    password: string;
    password_confirmation: string;
}