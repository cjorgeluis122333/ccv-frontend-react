
// Respuesta de Login
import type {SocioInfo, User} from "@/features/auth/types/index.ts";

export interface LoginResponse {
    status: string;
    access_token: string;
    token_type: string;
    user: User;
    socio_info: SocioInfo;
}

// Tipos para los formularios (Inputs)
export interface LoginCredentials {
    acc: string; // Lo manejamos como string en el input, aunque se envíe número
    password: string;
}
