
// Tarjeta para Familiar (Editable)
import type {FamilyMember} from "@/features/partner/types/partnerResponseType.ts";
import {useEffect, useMemo, useState} from "react";
import {partnerService} from "@/features/partner/service/partnerService.ts";
import { FamilyInputField } from "./FamilyInputField";
import {FamilySelectField} from "@/features/partner/component/FamilySelectedField.tsx";

export const FamilyMemberCard = ({ member, number }: { member: FamilyMember, number: number }) => {
    const [formData, setFormData] = useState<Partial<FamilyMember>>(member);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sincronizar si cambia el miembro (por ej., al seleccionar otro titular diferente)
    useEffect(() => {
        setFormData(member);
        setSaveStatus(null);
    }, [member]);

    // Limpiar alertas
    useEffect(() => {
        if (saveStatus) {
            const timer = setTimeout(() => setSaveStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleInputChange = (field: keyof FamilyMember, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const hasChanges = useMemo(() => {
        return Object.keys(formData).some((key) => {
            const k = key as keyof FamilyMember;
            const formVal = formData[k] === null || formData[k] === undefined ? '' : formData[k].toString();
            const originalVal = member[k] === null || member[k] === undefined ? '' : member[k].toString();
            return formVal !== originalVal;
        });
    }, [formData, member]);

    const handleSave = async () => {
        if (!hasChanges) return;
        setIsSaving(true);
        setSaveStatus(null);

        try {
            await partnerService.updateFamily(member.ind, formData);
            setSaveStatus({ type: 'success', message: 'Familiar actualizado' });
        } catch (error) {
            console.error("Error al actualizar familiar:", error);
            setSaveStatus({ type: 'error', message: 'Error de actualización' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-fuchsia-200 hover:shadow-md transition-all duration-300 group">
            {/* Cabecera del familiar editable */}
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4 group-hover:bg-fuchsia-50/30 transition-colors">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-500 shadow-sm">
                        {number}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base">{formData.nombre || 'Sin nombre registrado'}</h3>
                    <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-fuchsia-200 flex-shrink-0">
                        {formData.direccion || 'Familiar'}
                    </span>
                </div>

                <div className="flex items-center gap-3 self-end xl:self-auto">
                    {saveStatus && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 animate-in fade-in
                            ${saveStatus.type === 'success' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                            <span className="material-symbols-rounded text-[14px]">
                                {saveStatus.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {saveStatus.message}
                        </span>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all
                            ${!hasChanges
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed hidden xl:flex'
                            : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 hover:shadow-md active:scale-95'}`}
                    >
                        {isSaving ? (
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
                    <FamilyInputField label="Nombre Completo" field="nombre" value={formData.nombre} onChange={handleInputChange} icon="person" />
                    <FamilyInputField label="Cédula" field="cedula" value={formData.cedula} onChange={handleInputChange} icon="badge" type="number" />
                    <FamilyInputField label="Carnet" field="carnet" value={formData.carnet} onChange={handleInputChange} icon="id_card" />
                    <FamilyInputField label="Celular" field="celular" value={formData.celular} onChange={handleInputChange} icon="smartphone" />
                    <FamilySelectField
                        label="Teléfono"
                        field="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        icon="call"
                        options={[{ label: 'Sí', value: 'Si' }, { label: 'No', value: 'No' }]}
                    />
                    <FamilyInputField label="Parentesco/Dirección" field="direccion" value={formData.direccion} onChange={handleInputChange} icon="family_restroom" />
                    <FamilyInputField label="Nacimiento" field="nacimiento" value={formData.nacimiento} onChange={handleInputChange} icon="cake" type="date" />
                </div>
            </div>
        </div>
    );
};