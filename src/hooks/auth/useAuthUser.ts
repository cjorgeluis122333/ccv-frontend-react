import {useState} from "react";
import {authService} from "@/features/auth/services/authService.ts";

export const useAuthUser = () => {
    // Inicializamos el estado leyendo directamente del servicio
    const [user] = useState(() => authService.getUser());
    return user;
};