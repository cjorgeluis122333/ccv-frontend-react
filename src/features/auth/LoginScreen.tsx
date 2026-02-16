import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router-dom';
import {Input} from "@/components/Input";
import {Button} from "@/components/Button";
import {type LoginFormValues, loginSchema} from './schemas/loginSchema.ts';
import {useLogin} from './hooks/useLogin';
import {AuthLayout} from './components/layout/AuthLayout.tsx';

export const LoginScreen = () => {
    // 1. Hook de lógica de negocio
    const {login, isLoading} = useLogin();

    // 2. Configuración de React Hook Form con Zod
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormValues>(
        {resolver: zodResolver(loginSchema)}
    );

    return (

        <AuthLayout
            title="Bienvenido"
            subtitle="Ingresa tus credenciales para acceder"
        >

            {/* Formulario */}
            {/* Pasamos la función 'login' del hook al handleSubmit */}
            <form onSubmit={handleSubmit(login)} className="space-y-5">
                <Input
                    label="Número de Acción"
                    placeholder="Ej: 1234"
                    error={errors.acc?.message}
                    {...register("acc")}
                />

                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Button type="submit" isLoading={isLoading}>
                    Iniciar Sesión
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    ¿Aún no tienes cuenta?{' '}
                    <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Regístrate ahora
                    </Link>
                </p>
            </div>


            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="mt-8 text-xs text-slate-400 font-medium">
                    © 2026 CCV User Interface.
                </p>
            </div>
        </AuthLayout>

    );
};