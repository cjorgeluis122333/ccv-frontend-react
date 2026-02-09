import api from '@/lib/axios';
import type {UserInfo} from "@/features/auth/types/userInfoType.ts";
import type {LoginCredentials, LoginResponse} from "@/features/auth/types/loginTypes.ts";
import type {RegisterCredentials, RegisterResponse} from "@/features/auth/types/registerTypes.ts";


export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const {data} = await api.post<LoginResponse>('/login', credentials);
        return data;
    },

    register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
        const {data} = await api.post<RegisterResponse>('/register', credentials);
        return data;
    },

    setSession: (token: string, user: UserInfo) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Guardamos el objeto como string
    },
    getUser: (): UserInfo | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error al leer usuario del storage", error);
            return null;
        }
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