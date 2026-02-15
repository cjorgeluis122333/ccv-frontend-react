import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { authService } from '../services/authService';
import type { RegisterFormValues } from '../schemas/registerSchemas.ts';
import {authAdapter} from "@/features/auth/adapter/authAdapter.ts";

export const useRegister = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const registerUser = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setServerError(null);

        try {
            // 1. Petición (El service debe aceptar RegisterFormValues)
            const response = await authService.register(data);

            // 2. Adaptación (Usamos el nuevo método del adapter)
            const userToSave = authAdapter.toUserFromRegister(response);

            // 3. Persistencia
            authService.setSession(response.access_token, userToSave);

            // 4. Feedback
            showToast(response.message || "¡Registro exitoso!", 'success');
            navigate('/dashboard');

        }//TODO: create a type for errors
        catch (error: any) {
            // Lógica para extraer el mensaje de error del backend
            const msg = error.response?.data?.message || error.message || "Error al crear la cuenta";
            setServerError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return { registerUser, isLoading, serverError };
};