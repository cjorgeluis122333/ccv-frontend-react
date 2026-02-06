import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {registerSchema} from '../schemas/authSchemas';
import {authService} from '../services/authService';
import {useNavigate} from 'react-router-dom';
import type {z} from 'zod';

//The date write for the user before validate
type RegisterFormInputs = z.input<typeof registerSchema>;
//The date write for the user after validate
type RegisterDTO = z.output<typeof registerSchema>;
export const RegisterForm = () => {
    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            const parsedData: RegisterDTO = registerSchema.parse(data);

            const response = await authService.register(parsedData);
            authService.setSession(response.access_token);
            alert(response.message);
            navigate('/dashboard');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Error en el registro. Verifica los datos.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-bold text-gray-900">Crear Cuenta</h2>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Acción */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Acción</label>
                        <input type="number" {...register("acc")}
                               className="w-full border p-2 rounded-md"/>
                        {errors.acc && <p className="text-red-500 text-xs">{errors.acc.message}</p>}
                    </div>

                    {/* Cédula */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Cédula</label>
                        <input type="number" {...register("cedula")}
                               className="w-full border p-2 rounded-md"/>
                        {errors.cedula && <p className="text-red-500 text-xs">{errors.cedula.message}</p>}
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Correo</label>
                        <input type="email" {...register("correo")} className="w-full border p-2 rounded-md"/>
                        {errors.correo && <p className="text-red-500 text-xs">{errors.correo.message}</p>}
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <input type="password" {...register("password")} className="w-full border p-2 rounded-md"/>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Confirmar</label>
                            <input type="password" {...register("password_confirmation")}
                                   className="w-full border p-2 rounded-md"/>
                            {errors.password_confirmation &&
                                <p className="text-red-500 text-xs">{errors.password_confirmation.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
};