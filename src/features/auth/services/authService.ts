import api from '@/lib/axios';
import type {LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse} from "../types";


export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/login', credentials);
        return data;
    },

    register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
        const { data } = await api.post<RegisterResponse>('/register', credentials);
        return data;
    },

    // Método útil para guardar la sesión
    setSession: (token: string) => {
        localStorage.setItem('token', token);
        // Aquí podrías configurar headers globales si fuera necesario
    },

    logout: () => {
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Opcional: forzar recarga
    }
};