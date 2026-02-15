import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { loginSchema } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import {Input} from "@/components/Input.tsx";
import {Button} from "@/components/Button.tsx";
import type { z } from 'zod';
import type {UserInfo} from "@/features/auth/types/userInfoType.ts";

// Inferimos el tipo TypeScript automáticamente desde Zod
type LoginFormInputs = z.infer<typeof loginSchema>;
export const LoginForm = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setServerError(null);
        try {
            // 1. Hacemos la petición
            const response = await authService.login(data);
            // 2. Make a mapper
            const userToSave: UserInfo = {
                action: response.socio_info.acc,       // Mapeamos 'acc' a 'action'
                email: response.socio_info.correo,     // Mapeamos 'correo' a 'email'
                name: response.socio_info.nombre,      // Mapeamos 'nombre' a 'name'
                occupation: response.socio_info.ocupacion // Mapeamos 'ocupacion' a 'occupation'
            };

            // 3. Guardamos en sesión el token y el objeto YA convertido
            authService.setSession(response.access_token, userToSave); // Aquí podrías guardar el 'response.user' en un Global Store (Context/Zustand)
            showToast(`¡Bienvenido de nuevo, ${response.socio_info.nombre}!`, 'success');
            navigate('/dashboard');
        } catch  {
            const errorMsg = "Credenciales inválidas o error de conexión";
            setServerError(errorMsg);
            showToast(errorMsg, 'error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
            {/* Contenedor Principal */}
            <div className="w-full max-w-[400px] bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                {/* Cabecera */}
                <div className="text-center space-y-2 mb-8">

                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenido</h1>
                    <p className="text-slate-500 text-sm">Ingresa tus credenciales para acceder</p>
                </div>

                {serverError && (
                    <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center animate-shake">
                        {serverError}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Número de Acción"
                        placeholder="Ej: 1234"
                        error={errors.acc?.message as string}
                        {...register("acc")}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message as string}
                        {...register("password")}
                    />

                    {/*<div className="flex justify-end">*/}
                    {/*    <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 ">*/}
                    {/*        ¿Olvidaste tu contraseña?*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <Button type="submit" isLoading={isSubmitting}>
                        Iniciar Sesión
                    </Button>
                </form>

                {/* Footer de Registro */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-sm text-slate-500">
                        ¿Aún no tienes cuenta?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Regístrate ahora
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer secundario */}
            <p className="mt-8 text-xs text-slate-400 font-medium">
                © 2026 CCV User Interface. Todos los derechos reservados.
            </p>
        </div>
    );
};