import { useForm } from 'react-hook-form';
import type { GuestPayload } from '../types/guestTypes';

interface GuestFormProps {
    onSubmit: (data: Omit<GuestPayload, 'acc' | 'fuente' | 'operador'>) => void;
    isSubmitting: boolean;
    serverErrors?: Record<string, string[]>;
}

interface FormValues {
    nombre: string;
    cedula: string;
    fecha: string;
}

export const GuestForm = ({ onSubmit, isSubmitting, serverErrors }: GuestFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">
                        Nombre (*)
                    </label>
                    <input
                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                        type="text"
                        placeholder="Ej. Juan Perez"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                    />
                    {errors.nombre && <p className="text-xs text-rose-500 font-medium">{errors.nombre.message}</p>}
                    {serverErrors?.nombre && <p className="text-xs text-rose-500 font-medium">{serverErrors.nombre[0]}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">
                        Cédula (*)
                    </label>
                    <input
                        {...register('cedula', { required: 'La cédula es obligatoria' })}
                        type="text"
                        placeholder="Ej. 12345678"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                    />
                    {errors.cedula && <p className="text-xs text-rose-500 font-medium">{errors.cedula.message}</p>}
                    {serverErrors?.cedula && <p className="text-xs text-rose-500 font-medium">{serverErrors.cedula[0]}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">
                        Fecha de Visita (*)
                    </label>
                    <input
                        {...register('fecha', { required: 'La fecha es obligatoria' })}
                        type="date"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                    />
                    {errors.fecha && <p className="text-xs text-rose-500 font-medium">{errors.fecha.message}</p>}
                    {serverErrors?.fecha && <p className="text-xs text-rose-500 font-medium">{serverErrors.fecha[0]}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <span className="material-symbols-rounded animate-spin text-[20px]">progress_activity</span>
                            Registrando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-rounded text-[20px]">person_add</span>
                            Registrar Invitado
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
