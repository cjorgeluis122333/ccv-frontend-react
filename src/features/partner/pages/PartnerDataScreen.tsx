import {useState} from 'react';
import {usePartners} from '../hooks/usePartners';
import type {FamilyMember, Partner} from '../types/partnerResponseType';
import {partnerService} from '../service/partnerService';
import {usePartnerForm} from "@/features/partner/hooks/usePartnerForm.ts";
import {useSearchPartner} from "@/features/partner/hooks/useSearchPartner.ts";
import {InputField} from '@/components/input/InputField';
import {FamilyMemberCard} from "@/features/partner/component/FamilyMemberCard.tsx";
import {GenericSearch} from "@/components/input/SearchAutocomplete.tsx";

export const PartnerDataScreen = () => {
    // 1. Estado Global y del Dominio
    const {partners, searchTerm, setSearchTerm, isLoading, refresh} = usePartners();

    // 2. Estado Local del Componente
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [isLoadingFamily, setIsLoadingFamily] = useState(false);

    // 3. Integración de Hooks Personalizados
    const {
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        handleSearchChange
    } = useSearchPartner(setSearchTerm, () => {
        // Callback: Qué hacer cuando se limpia el buscador
        setSelectedPartner(null);
        setFamilyMembers([]);
    });

    const {
        formData,
        isSaving,
        saveStatus,
        hasChanges,
        handleInputChange,
        handleSave,
        resetForm // <-- Extraemos la nueva función
    } = usePartnerForm(selectedPartner, (updatedPartner) => {
        setSelectedPartner(updatedPartner);
        resetForm(updatedPartner); // Sincronizamos tras guardar
        refresh();
    });
    // Select partner
    const handleSelectPartner = async (partner: Partner) => {
        setSelectedPartner(partner);
        resetForm(partner); // <--- Actualiza el formulario al instante
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);

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
    return (
        <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div
                className="flex flex-col justify-between items-start gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                    <div
                        className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">badge</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Datos del Socio
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Búsqueda y edición de información de socios y
                            familiares.</p>
                    </div>
                </div>
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
            <GenericSearch<Partner>
                label="Buscar Socio Titular"
                placeholder="Buscar por nombre, cédula o número de acción (acc)..."
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                isLoading={isLoading}
                isDropdownOpen={isDropdownOpen}
                items={partners}
                onSelectItem={handleSelectPartner}
                dropdownRef={dropdownRef}
                keyExtractor={(partner) => partner.acc}
                renderItem={(partner) => (
                    <>
                        <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {partner.nombre}
                        </div>
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
                    </>
                )}
            />

            {selectedPartner && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {/* Tarjeta del Titular */}
                    <div
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-rounded text-indigo-500">person</span>
                                Información del Titular
                            </h2>
                            {hasChanges && (
                                <span
                                    className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
                                    <span className="material-symbols-rounded text-[14px]">edit</span>
                                    Cambios sin guardar
                                </span>
                            )}
                        </div>

                        <div className="p-6 sm:p-8 flex-1">
                            <div
                                className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-8 lg:gap-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div
                                        className="w-full aspect-square max-w-[220px] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                                        <span
                                            className="material-symbols-rounded text-7xl text-slate-200 group-hover:scale-110 transition-transform duration-300">account_circle</span>
                                        <div
                                            className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300"/>
                                    </div>
                                    <span
                                        className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                        Foto Titular
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                                    <div className="space-y-1.5 group">
                                        <label
                                            className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                            <span className="material-symbols-rounded text-[1.2em]">tag</span>
                                            Acción (Acc)
                                        </label>
                                        <div
                                            className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold text-sm h-[46px] flex items-center shadow-inner select-none cursor-not-allowed">
                                            {formData.acc}
                                        </div>
                                    </div>

                                    <InputField label="Cédula" field="cedula" value={formData.cedula || ''}
                                                onChange={handleInputChange} icon="badge" type="number"/>
                                    <InputField label="Carnet" field="carnet" value={formData.carnet || ''}
                                                onChange={handleInputChange} icon="id_card"/>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <InputField label="Nombre Completo" field="nombre" value={formData.nombre || ''}
                                                    onChange={handleInputChange} icon="person"/>
                                    </div>

                                    <InputField label="Celular" field="celular" value={formData.celular || ''}
                                                onChange={handleInputChange} icon="phone_iphone"/>
                                    <InputField label="Teléfono" field="telefono" value={formData.telefono || ''}
                                                onChange={handleInputChange} icon="call"/>
                                    <InputField label="Correo Electrónico" field="correo" value={formData.correo || ''}
                                                onChange={handleInputChange} icon="mail" type="email"/>

                                    <div className="sm:col-span-2 lg:col-span-3">
                                        <InputField label="Dirección" field="direccion" value={formData.direccion || ''}
                                                    onChange={handleInputChange} icon="location_on"/>
                                    </div>

                                    <InputField label="Fecha Nacimiento" field="nacimiento"
                                                value={formData.nacimiento || ''} onChange={handleInputChange}
                                                icon="cake" type="date"/>
                                    <InputField label="Fecha Ingreso" field="ingreso" value={formData.ingreso || ''}
                                                onChange={handleInputChange} icon="calendar_month" type="date"/>
                                    <InputField label="Ocupación" field="ocupacion" value={formData.ocupacion || ''}
                                                onChange={handleInputChange} icon="work"/>

                                    <InputField label="Cobrador" field="cobrador" value={formData.cobrador || ''}
                                                onChange={handleInputChange} icon="account_balance_wallet"/>
                                </div>
                            </div>
                        </div>

                        {/* Footer Titular con el Botón Guardar */}
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving || !selectedPartner}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all
                                    ${!selectedPartner || !hasChanges
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed hidden md:flex'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'}`}
                            >
                                {isSaving ? (
                                    <span
                                        className="material-symbols-rounded text-xl animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-rounded text-xl">save</span>
                                )}
                                <span>{isSaving ? 'Guardando...' : 'Guardar Cambios del Titular'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Sección de Familiares */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3">
                            <span className="material-symbols-rounded text-fuchsia-500 text-2xl">family_restroom</span>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Carga Familiar Registrada</h2>
                                <p className="text-xs text-slate-500 font-medium">Familiares asociados al
                                    titular {selectedPartner.nombre}</p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-slate-50/30">
                            {isLoadingFamily ? (
                                <div
                                    className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-4">
                                    <span
                                        className="material-symbols-rounded text-5xl animate-spin text-indigo-400">progress_activity</span>
                                    <p className="font-semibold text-sm">Cargando grupo familiar...</p>
                                </div>
                            ) : familyMembers.length === 0 ? (
                                <div
                                    className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                    <div
                                        className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                        <span
                                            className="material-symbols-rounded text-3xl">sentiment_dissatisfied</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-700 font-bold mb-1">Sin carga familiar</h3>
                                        <p className="text-slate-500 text-sm max-w-sm">Este socio titular no tiene
                                            familiares asociados o registrados en el sistema en este momento.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {familyMembers.map((member, index) => (
                                        <FamilyMemberCard key={member.ind} member={member} number={index + 1}/>
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
                    <div
                        className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <span className="material-symbols-rounded text-5xl">search</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Comience a buscar</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Utilice la barra de búsqueda superior para encontrar un socio y visualizar o editar sus datos
                        junto con su grupo familiar asociado.
                    </p>
                </div>
            )}
        </div>
    );
};


