// src/features/auth/hooks/useLogout.ts
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {mainService} from "@/services/mainService.ts";
import {useToast} from "@/contexts/ToastContext.tsx";

export const useLogout = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const {showToast} = useToast();

    const logout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            await mainService.logout()
            showToast(`Se ha cerrado sección correctamente !`, 'success');

        } catch (error) {
            showToast("A ocurrido un error mientras se cerraba sección. Verifique su conexión a internet", 'error');
            console.error("Logout fallido en servidor, pero sesión cerrada localmente", error);
        } finally {
            setIsLoggingOut(false);
            // 'replace: true' evita que el usuario vuelva atrás con el botón del navegador
            navigate('/login', {replace: true});
        }
    };

    return {logout, isLoggingOut};
};