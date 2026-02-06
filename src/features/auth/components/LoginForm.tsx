import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { z } from 'zod';

// Inferimos el tipo TypeScript automáticamente desde Zod
type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setError(null);
        try {
            const response = await authService.login(data);
            authService.setSession(response.access_token);
            // Aquí podrías guardar el 'response.user' en un Global Store (Context/Zustand)
            console.log("Bienvenido:", response.socio_info.nombre);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError("Credenciales inválidas o error de conexión");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-900">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Acción (Número)</label>
                            <input
                                {...register("acc")}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Ej: 1"
                            />
                            {errors.acc && <p className="text-red-500 text-xs mt-1">{errors.acc.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                {...register("password")}
                                type="password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Entrando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};