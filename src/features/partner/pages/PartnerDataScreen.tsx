import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePartners } from '../hooks/usePartners';
import type { Partner, FamilyMember } from '../types/partnerResponseType';
import { partnerService } from '../service/partnerService';

export const PartnerDataScreen = () => {
    const { partners, searchTerm, setSearchTerm, isLoading, refresh } = usePartners();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Titular State
    const [formData, setFormData] = useState<Partial<Partner>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Family State
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [isLoadingFamily, setIsLoadingFamily] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Limpiar alertas después de 3 segundos
    useEffect(() => {
        if (saveStatus) {
            const timer = setTimeout(() => setSaveStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        if (!e.target.value) {
            setSelectedPartner(null);
            setFormData({});
            setFamilyMembers([]);
            setSaveStatus(null);
        }
    };

    const handleSelectPartner = async (partner: Partner) => {
        setSelectedPartner(partner);
        setFormData(partner); // Inicializar form data
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);
        setSaveStatus(null);

        // Fetch Family Members
        setIsLoadingFamily(true);
        try {
            const familyRes = await partnerService.getFamily(partner.acc);
            setFamilyMembers(familyRes.data || []);
        } catch (error) {
            console.error("Error fetching family members:", error);
            setFamilyMembers([]);
        } finally {
            setIsLoadingFamily(false);
        }
    };

    const handleInputChange = (field: keyof Partner, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const hasChanges = useMemo(() => {
        if (!selectedPartner) return false;
        return Object.keys(formData).some((key) => {
            const k = key as keyof Partner;
            const formVal = formData[k] || '';
            const originalVal = selectedPartner[k] || '';
            return formVal !== originalVal;
        });
    }, [formData, selectedPartner]);

    const handleSave = async () => {
        if (!selectedPartner || !hasChanges) return;

        setIsSaving(true);
        setSaveStatus(null);

        try {
            const updatedPartner = await partnerService.update(selectedPartner.acc, formData);
            setSelectedPartner(updatedPartner);
            setFormData(updatedPartner);
            setSaveStatus({ type: 'success', message: 'Datos actualizados correctamente' });
            refresh();
        } catch (error) {
            console.error(error);
            setSaveStatus({ type: 'error', message: 'Error al actualizar los datos del socio' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">badge</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Datos del Socio
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Búsqueda y edición de información de socios y familiares.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving || !selectedPartner}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all
                        ${!selectedPartner || !hasChanges
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'}`}
                >
                    {isSaving ? (
                        <span className="material-symbols-rounded text-xl animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-rounded text-xl">save</span>
                    )}
                    <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
            </div>

            {saveStatus && (
                <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 animate-in slide-in-from-top-2
                    ${saveStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
                >
                    <span className="material-symbols-rounded">
                        {saveStatus.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {saveStatus.message}
                </div>
            )}

            {/* Búsqueda */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-10" ref={dropdownRef}>
                <label className="block text-sm font-bold text-slate-700 mb-2">Buscar Socio Titular</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-xl pointer-events-none">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula o número de acción (acc)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                    />
                    {isLoading && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-indigo-500 animate-spin">
                            progress_activity
                        </span>
                    )}
                </div>

                {/* Dropdown */}
                {isDropdownOpen && searchTerm.trim() !== '' && partners.length > 0 && (
                    <div className="absolute z-50 w-[calc(100%-3rem)] mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {partners.map((partner) => (
                            <div
                                key={partner.acc}
                                onClick={() => handleSelectPartner(partner)}
                                className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                                <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{partner.nombre}</div>
                                <div className="text-xs text-slate-500 flex gap-4 mt-1.5">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-rounded text-[14px]">tag</span>
                                        <span className="font-semibold text-slate-600">Acc: {partner.acc}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-rounded text-[14px]">badge</span>
                                        <span className="font-semibold text-slate-600">C.I: {partner.cedula}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedPartner && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {/* Tarjeta del Titular */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-rounded text-indigo-500">person</span>
                                Información del Titular
                            </h2>
                            {hasChanges && (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
                                    <span className="material-symbols-rounded text-[14px]">edit</span>
                                    Cambios sin guardar
                                </span>
                            )}
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-8 lg:gap-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full aspect-square max-w-[220px] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                                        <span className="material-symbols-rounded text-7xl text-slate-200 group-hover:scale-110 transition-transform duration-300">account_circle</span>
                                        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                        Foto Titular
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                            <span className="material-symbols-rounded text-[1.2em]">tag</span>
                                            Acción (Acc)
                                        </label>
                                        <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold text-sm h-[46px] flex items-center shadow-inner select-none cursor-not-allowed">
                                            {formData.acc}
                                        </div>
                                    </div>

                                    <InputField label="Cédula" field="cedula" value={formData.cedula} onChange={handleInputChange} icon="badge" type="number" />
                                    <InputField label="Carnet" field="carnet" value={formData.carnet} onChange={handleInputChange} icon="id_card" />

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <InputField label="Nombre Completo" field="nombre" value={formData.nombre} onChange={handleInputChange} icon="person" />
                                    </div>

                                    <InputField label="Celular" field="celular" value={formData.celular} onChange={handleInputChange} icon="phone_iphone" />
                                    <InputField label="Teléfono" field="telefono" value={formData.telefono} onChange={handleInputChange} icon="call" />
                                    <InputField label="Correo Electrónico" field="correo" value={formData.correo} onChange={handleInputChange} icon="mail" type="email" />

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <InputField label="Dirección" field="direccion" value={formData.direccion} onChange={handleInputChange} icon="location_on" />
                                    </div>

                                    <InputField label="Fecha Nacimiento" field="nacimiento" value={formData.nacimiento} onChange={handleInputChange} icon="cake" type="date" />
                                    <InputField label="Fecha Ingreso" field="ingreso" value={formData.ingreso} onChange={handleInputChange} icon="calendar_month" type="date" />
                                    <InputField label="Ocupación" field="ocupacion" value={formData.ocupacion} onChange={handleInputChange} icon="work" />

                                    <InputField label="Cobrador" field="cobrador" value={formData.cobrador} onChange={handleInputChange} icon="account_balance_wallet" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Familiares */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3">
                            <span className="material-symbols-rounded text-fuchsia-500 text-2xl">family_restroom</span>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Carga Familiar Registrada</h2>
                                <p className="text-xs text-slate-500 font-medium">Familiares asociados al titular {selectedPartner.nombre}</p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-slate-50/30">
                            {isLoadingFamily ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-4">
                                    <span className="material-symbols-rounded text-5xl animate-spin text-indigo-400">progress_activity</span>
                                    <p className="font-semibold text-sm">Cargando grupo familiar...</p>
                                </div>
                            ) : familyMembers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                        <span className="material-symbols-rounded text-3xl">sentiment_dissatisfied</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-700 font-bold mb-1">Sin carga familiar</h3>
                                        <p className="text-slate-500 text-sm max-w-sm">Este socio titular no tiene familiares asociados o registrados en el sistema en este momento.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {familyMembers.map((member, index) => (
                                        <FamilyMemberCard key={member.ind} member={member} number={index + 1} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Estado Inicial */}
            {!selectedPartner && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <span className="material-symbols-rounded text-5xl">search</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Comience a buscar</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Utilice la barra de búsqueda superior para encontrar un socio y visualizar o editar sus datos junto con su grupo familiar asociado.
                    </p>
                </div>
            )}
        </div>
    );
};

// Componente para inputs del Titular (Editable)
const InputField = ({ label, field, value, onChange, icon, type = "text" }: {
    label: string, field: keyof Partner, value: string | number | null | undefined,
    onChange: (f: keyof Partner, v: string) => void, icon: string, type?: string
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1.5 group">
            <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-1.5 hover:cursor-text">
                <span className="material-symbols-rounded text-[1.2em]">{icon}</span>
                {label}
            </label>
            <input
                type={type}
                value={displayValue}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm h-[46px] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder={`Ingrese ${label.toLowerCase()}`}
            />
        </div>
    );
};

// Tarjeta para Familiar (Editable)
const FamilyMemberCard = ({ member, number }: { member: FamilyMember, number: number }) => {
    const [formData, setFormData] = useState<Partial<FamilyMember>>(member);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sincronizar si cambia el miembro (por ej, al seleccionar otro titular diferente)
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

// Input con Select para el formulario de familiares
const FamilySelectField = ({ label, field, value, onChange, icon, options }: {
    label: string, field: keyof FamilyMember, value: string | number | null | undefined,
    onChange: (f: keyof FamilyMember, v: string) => void, icon: string, options: { label: string, value: string }[]
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1 group relative">
            <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-fuchsia-600 transition-colors uppercase tracking-widest flex items-center gap-1 hover:cursor-text">
                <span className="material-symbols-rounded text-[14px]">{icon}</span>
                {label}
            </label>
            <div className="relative">
                <select
                    value={displayValue}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm h-[38px] shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 hover:border-slate-300 transition-all appearance-none pr-8 cursor-pointer"
                >
                    <option value="" disabled className="text-slate-400 font-normal">Seleccione...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
                    <span className="material-symbols-rounded text-[18px]">expand_more</span>
                </div>
            </div>
        </div>
    );
};

// Input reducido para el formulario de familiares
const FamilyInputField = ({ label, field, value, onChange, icon, type = "text" }: {
    label: string, field: keyof FamilyMember, value: string | number | null | undefined,
    onChange: (f: keyof FamilyMember, v: string) => void, icon: string, type?: string
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-fuchsia-600 transition-colors uppercase tracking-widest flex items-center gap-1 hover:cursor-text">
                <span className="material-symbols-rounded text-[14px]">{icon}</span>
                {label}
            </label>
            <input
                type={type}
                value={displayValue}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm h-[38px] shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder={label}
            />
        </div>
    );
};
