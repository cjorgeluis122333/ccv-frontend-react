// src/features/auth/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { authService } from '../services/authService';
import type { LoginFormValues } from '../schemas/loginSchema.ts';
import {authAdapter} from "@/features/auth/adapter/authAdapter.ts";

export const useLogin = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (data: LoginFormValues) => {
        setIsLoading(true);

        try {
            // 1. Petición al servicio
            const response = await authService.login(data);

            // 2. Mapper the Request to UserInfo
            const userToSave = authAdapter.toUserInfo(response);

            // 3. Persistencia(Save in localStorage)
            authService.setSession(response.access_token, userToSave);

            // 4. Feedback y Navegación
            showToast(`¡Bienvenido de nuevo, ${userToSave.name}!`, 'success');
            navigate('/dashboard');

        } catch  {
            // Manejo robusto de errores
            const errorMsg = "Credenciales inválidas o error de conexión";
            // Si tu backend devuelve mensajes de error, podrías usar: error.response?.data?.message || errorMsg
            showToast(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading
    };
};