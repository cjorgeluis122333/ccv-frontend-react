// Tarjeta para Familiar (Editable)
import type { FamilyMember } from "@/features/partner/types/partnerResponseType.ts";
import { useEffect } from "react";
import { partnerService } from "@/features/partner/service/partnerService.ts";
import { INPUT_THEMES } from "@/utils/inputTheme.ts";
import { useToast } from "@/contexts/ToastContext.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familiarSchema, type FamiliarFormValues } from "../schemas/familiarSchema.ts";
import { SmartInput } from "@/components/input/SmartInput.tsx";
import { InputSelectedOption } from "@/components/input/InputSelectedOption.tsx";

export const FamilyMemberCard = ({ member, number }: { member: FamilyMember, number: number }) => {
    const { showToast } = useToast();

    // 1. Configuramos react-hook-form con Zod
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting }
    } = useForm<FamiliarFormValues>({
        resolver: zodResolver(familiarSchema),
        defaultValues: {
            // Transformamos member() a los defaults para RHF
            nombre: member.nombre || '',
            cedula: String(member.cedula || ''), // el Schema espera string para regex
            carnet: member.carnet || '',
            celular: member.celular || '',
            telefono: member.telefono || '',
            direccion: member.direccion || '',
            nacimiento: member.nacimiento || '',
        }
    });

    // 2. Sincronizar si cambia el miembro externo (ej: al cargar otro socio titular)
    useEffect(() => {
        reset({
            nombre: member.nombre || '',
            cedula: String(member.cedula || ''),
            carnet: member.carnet || '',
            celular: member.celular || '',
            telefono: member.telefono || '',
            direccion: member.direccion || '',
            nacimiento: member.nacimiento || '',
        });
    }, [member, reset]);

    const onSubmit = async (data: FamiliarFormValues) => {
        if (!isDirty) return;
        try {
            // Transformamos datos de vuelta al formato del backend si es necesario
            const mappedData: Partial<FamilyMember> = {
                ...data,
                cedula: Number(data.cedula)
            };

            // El backend acepta la data gracias a nuestra lógica previa
            await partnerService.updateFamily(member.ind, mappedData);

            // Refrescamos los valores en RHF para que vuelva a su estado initial (!isDirty)
            reset(data);
            showToast(`¡Familiar actualizado!`, 'success');
        } catch (error) {
            console.error("Error al actualizar familiar:", error);
            showToast('Error de actualización', 'error');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-fuchsia-200 hover:shadow-md transition-all duration-300 group"
        >
            {/* Cabecera del familiar editable */}
            <div
                className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4 group-hover:bg-fuchsia-50/30 transition-colors">
                <div className="flex items-center gap-3">
                    <span
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-500 shadow-sm">
                        {number}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base">{member.nombre || 'Sin nombre registrado'}</h3>
                    <span
                        className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-fuchsia-200 flex-shrink-0">
                        {member.direccion || 'Familiar'}
                    </span>
                </div>

                <div className="flex items-center gap-3 self-end xl:self-auto">
                    <button
                        type="submit"
                        disabled={!isDirty || isSubmitting}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all
                            ${!isDirty
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed hidden xl:flex'
                                : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 hover:shadow-md active:scale-95'}`}
                    >
                        {isSubmitting ? (
                            <span className="material-symbols-rounded text-sm animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-rounded text-sm">save</span>
                        )}
                        <span>Guardar</span>
                    </button>
                </div>
            </div>

            {/* Formulario del familiar */}
            <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                    <SmartInput
                        label="Nombre Completo"
                        {...register('nombre')}
                        error={errors.nombre?.message}
                        icon="person"
                        styles={INPUT_THEMES.fuchsia}
                    />

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
                        label="Parentesco/Dirección"
                        {...register('direccion')}
                        error={errors.direccion?.message}
                        icon="family_restroom"
                        styles={INPUT_THEMES.fuchsia}
                    />

                    <SmartInput
                        label="Nacimiento (YYYY-MM-DD)"
                        type="date"
                        {...register('nacimiento')}
                        error={errors.nacimiento?.message}
                        icon="cake"
                        styles={INPUT_THEMES.fuchsia}
                    />
                </div>
            </div>
        </form>
    );
};