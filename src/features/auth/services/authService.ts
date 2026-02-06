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

    logout: async () => {
        try {
            // 1. Intentamos invalidar el token en el servidor
            await api.post('/logout');
        } catch (error) {
            // Opcional: Manejar error si el servidor falla,
            // pero usualmente queremos cerrar sesión localmente de todos modos.
            console.error("Error al cerrar sesión en servidor", error);
        } finally {
            // 2. Limpiamos el token local (Store/LocalStorage)
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Si guardas datos del usuario
        }
    }
};