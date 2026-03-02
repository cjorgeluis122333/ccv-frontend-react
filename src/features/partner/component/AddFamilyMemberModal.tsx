import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familiarSchema, type FamiliarFormValues } from "../schemas/familiarSchema.ts";
import { partnerService } from "../service/partnerService.ts";
import { useToast } from "@/contexts/ToastContext.tsx";
import { SmartInput } from "@/components/input/SmartInput.tsx";
import { InputSelectedOption } from "@/components/input/InputSelectedOption.tsx";
import { INPUT_THEMES } from "@/utils/inputTheme.ts";
import type { FamilyMember } from "../types/partnerResponseType.ts";

interface AddFamilyMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    acc: number;
    onSuccess: (newMember: FamilyMember) => void;
}

export const AddFamilyMemberModal = ({ isOpen, onClose, acc, onSuccess }: AddFamilyMemberModalProps) => {
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FamiliarFormValues>({
        resolver: zodResolver(familiarSchema),
        defaultValues: {
            nombre: '',
            cedula: '',
            carnet: '',
            celular: '',
            telefono: 'NO',
            direccion: '',
            nacimiento: '',
        }
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset({
                nombre: '',
                cedula: '',
                carnet: '',
                celular: '',
                telefono: 'NO',
                direccion: '',
                nacimiento: '',
            });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: FamiliarFormValues) => {
        try {
            const mappedData: Partial<FamilyMember> = {
                ...data,
                acc,
                cedula: Number(data.cedula),
                categoria: 'familiar',
                cobrador: 0
            };

            const newMember = await partnerService.createFamily(mappedData);
            showToast('Familiar agregado exitosamente', 'success');
            onSuccess(newMember);
            onClose();
        } catch (error) {
            console.error("Error creating family member:", error);
            showToast('Error al crear familiar', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isSubmitting ? onClose : undefined}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl">
                            <span className="material-symbols-rounded text-2xl block">person_add</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Agregar Nuevo Familiar</h2>
                            <p className="text-xs text-slate-500 font-medium">Complete los datos para registrar un familiar a la acción {acc}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <span className="material-symbols-rounded block">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                        <div className="sm:col-span-2 lg:col-span-3">
                            <SmartInput
                                label="Nombre Completo"
                                {...register('nombre')}
                                error={errors.nombre?.message}
                                icon="person"
                                styles={INPUT_THEMES.fuchsia}
                            />
                        </div>

                        <SmartInput
                            label="Cédula"
                            type="number"
                            {...register('cedula')}
                            error={errors.cedula?.message}
                            icon="badge"
                            styles={INPUT_THEMES.fuchsia}
                        />

                        <SmartInput
                            label="Carnet"
                            {...register('carnet')}
                            error={errors.carnet?.message}
                            icon="id_card"
                            styles={INPUT_THEMES.fuchsia}
                        />

                        <SmartInput
                            label="Celular"
                            type="tel"
                            {...register('celular')}
                            error={errors.celular?.message}
                            icon="smartphone"
                            styles={INPUT_THEMES.fuchsia}
                        />

                        <InputSelectedOption
                            label="Teléfono"
                            {...register('telefono')}
                            error={errors.telefono?.message}
                            icon="call"
                            options={[{ label: 'Sí', value: 'SI' }, { label: 'No', value: 'NO' }]}
                            styles={INPUT_THEMES.fuchsia}
                        />

                        <SmartInput
                            label="Parentesco"
                            {...register('direccion')}
                            error={errors.direccion?.message}
                            icon="family_restroom"
                            styles={INPUT_THEMES.fuchsia}
                            placeholder="Ej: ESPOSA, HIJO, etc."
                        />

                        <SmartInput
                            label="Fecha de Nacimiento"
                            type="date"
                            {...register('nacimiento')}
                            error={errors.nacimiento?.message}
                            icon="cake"
                            styles={INPUT_THEMES.fuchsia}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all border border-transparent"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-fuchsia-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-fuchsia-100 hover:bg-fuchsia-700 hover:shadow-fuchsia-200 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <span className="material-symbols-rounded text-xl animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-rounded text-xl">person_add</span>
                            )}
                            <span>{isSubmitting ? 'Registrando...' : 'Registrar Familiar'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
