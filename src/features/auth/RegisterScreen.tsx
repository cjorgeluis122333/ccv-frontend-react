import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

// Componentes Reutilizables
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

// Lógica y Esquemas
import { useRegister } from './hooks/useRegister';
import { AuthLayout } from './components/layout/AuthLayout';
import {
    type RegisterFormInputs, type RegisterFormValues,
    registerSchema
} from "@/features/auth/schemas/registerSchemas.ts";

export const RegisterScreen = () => {
    // 1. Hook de lógica
    const { registerUser, isLoading, serverError } = useRegister();

    // 2. Hook del formulario
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormInputs>({ // <--- Tipo de entrada
        resolver: zodResolver(registerSchema)
    });

    return (
        <AuthLayout
            title="Crear Cuenta"
            subtitle="Únete a nuestra comunidad"
        >
            {/* Mensaje de error del servidor */}
            {serverError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold text-center">
                    {serverError}
                </div>
            )}
            {/* 2. Forzamos el tipado en el submit.
               Como usamos zodResolver, handleSubmit garantiza que si se llama a
               registerUser, los datos ya pasaron por el esquema y son del tipo Output.
            */}
            <form
                onSubmit={handleSubmit((data) => registerUser(data as RegisterFormValues))}
                className="space-y-4"
            >
                {/* Inputs Numéricos */}
                <Input
                    label="Número de Acción"
                    placeholder="Ej: 1234"
                    type="number" // HTML5 type ayuda, pero Zod valida
                    error={errors.acc?.message}
                    {...register("acc")}
                />

                <Input
                    label="Cédula"
                    placeholder="Ej: 100200300"
                    type="number"
                    error={errors.cedula?.message}
                    {...register("cedula")}
                />

                {/* Correo */}
                <Input
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                    type="email"
                    error={errors.correo?.message}
                    {...register("correo")}
                />

                {/* Contraseñas en Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="••••••"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <Input
                        label="Confirmar"
                        type="password"
                        placeholder="••••••"
                        error={errors.password_confirmation?.message}
                        {...register("password_confirmation")}
                    />
                </div>

                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Registrarse
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};