import api from '@/lib/axios';
import type {UserInfo} from "@/features/auth/types/userInfoType.ts";
import type { LoginRequest, LoginResponse} from "@/features/auth/types/loginTypes.ts";
import type {RegisterRequest, RegisterResponse} from "@/features/auth/types/registerTypes.ts";


export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const {data} = await api.post<LoginResponse>('/login', credentials);
        return data;
    },

    register: async (credentials: RegisterRequest): Promise<RegisterResponse> => {
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

};