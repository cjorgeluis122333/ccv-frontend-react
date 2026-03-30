import { useCallback, useState } from 'react';
import { InputSearch } from "@/components/input/InputSearch.tsx";
import { usePartners } from '@/features/partner/hooks/usePartners';
import type { Partner } from '@/features/partner/types/partnerResponseType';
import { useGenericFilter } from "@/hooks/search/useGenericFilter.ts";
import { useSearchGeneric } from "@/hooks/search/useSearchPartner.ts";

import { GuestCurrentList } from '../components/GuestCurrentList';
import { GuestForm } from '../components/GuestForm';
import { GuestHistoryList } from '../components/GuestHistoryList';
import { useGuestFeature } from '../hooks/useGuestFeature';
import type { GuestPayload } from '../types/guestTypes';
import { PaymentFeedbackModal } from '@/features/payment/components/PaymentFeedbackModal';

type GuestSection = 'ingreso' | 'lista';

type GuestModalConfig = {
    isOpen: boolean;
    variant: 'success' | 'error' | 'warning';
    message: string;
    title?: string;
};

export const GuestScreen = () => {
    // Partner Search State
    const { partners: allPartners, searchTerm, setSearchTerm, isLoading: isPartnersLoading } = usePartners();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    // Guest Feature State
    const [activeSection, setActiveSection] = useState<GuestSection>('ingreso');
    const [loadedSections, setLoadedSections] = useState<{ ingreso: boolean; lista: boolean }>({ ingreso: false, lista: false });
    const {
        currentGuests,
        isCurrentLoading,
        currentError,
        paginatedGuests,
        isPaginatedLoading,
        paginatedError,
        isSubmitting,
        serverErrors,
        loadCurrentMonthGuests,
        loadPaginatedGuests,
        registerNewGuest,
        clearGuestData
    } = useGuestFeature();

    const [modalConfig, setModalConfig] = useState<GuestModalConfig>({
        isOpen: false,
        variant: 'success',
        message: '',
        title: undefined
    });

    const handleSearchReset = useCallback(() => {
        setSelectedPartner(null);
        setActiveSection('ingreso');
        clearGuestData();
    }, [clearGuestData]);

    const {
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        handleSearchChange
    } = useSearchGeneric(setSearchTerm, handleSearchReset);

    const { filteredItems, isFiltering } = useGenericFilter<Partner>({
        items: allPartners,
        searchTerm,
        filterFn: (partner, term) => {
            const nombre = partner.nombre?.toLowerCase() || "";
            const acc = String(partner.acc || "");
            const cedula = String(partner.cedula || "");
            return nombre.includes(term) || acc.includes(term) || cedula.includes(term);
        }
    });

    const handleSelectPartner = useCallback((partner: Partner) => {
        setSelectedPartner(partner);
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);
        setActiveSection('ingreso');
        clearGuestData();
        setLoadedSections({ ingreso: true, lista: false });
        void loadCurrentMonthGuests(partner.acc);
    }, [clearGuestData, loadCurrentMonthGuests, setIsDropdownOpen, setSearchTerm]);

    const handleSectionChange = useCallback((section: GuestSection) => {
        setActiveSection(section);
        if (!selectedPartner) return;

        if (section === 'ingreso' && !loadedSections.ingreso) {
            setLoadedSections(prev => ({ ...prev, ingreso: true }));
            void loadCurrentMonthGuests(selectedPartner.acc);
        } else if (section === 'lista' && !loadedSections.lista) {
            setLoadedSections(prev => ({ ...prev, lista: true }));
            void loadPaginatedGuests(selectedPartner.acc, 1);
        }
    }, [loadedSections, loadCurrentMonthGuests, loadPaginatedGuests, selectedPartner]);

    const handleFormSubmit = async (data: Omit<GuestPayload, 'acc' | 'fuente' | 'operador'>) => {
        if (!selectedPartner) return;

        const payload: GuestPayload = {
            ...data,
            acc: selectedPartner.acc,
            fuente: 'freevar',       // Requisito del endpoint
            operador: 'marisabel',   // Requisito del endpoint o info del usuario
        };

        const success = await registerNewGuest(payload);

        if (success) {
            setModalConfig({
                isOpen: true,
                variant: 'success',
                title: 'Invitado Registrado',
                message: 'El invitado ha sido registrado correctamente para este mes.'
            });
            // Al insertar, marcamos que el historial debe refrescarse
            setLoadedSections({ ingreso: true, lista: false }); 
            clearGuestData(); // Limpia caches y estados previos
            setLoadedSections({ ingreso: true, lista: false }); // Volvemos a marcar ingreso como cargado (lo haremos abajo)
            
            void loadCurrentMonthGuests(selectedPartner.acc);
        } else {
            setModalConfig({
                isOpen: true,
                variant: 'error',
                title: 'Error de Registro',
                message: 'Hubo un error al registrar al invitado. Revise los datos y vuelva a intentarlo.'
            });
        }
    };

    const handleHistoryPageChange = useCallback((page: number) => {
        if (selectedPartner) {
            void loadPaginatedGuests(selectedPartner.acc, page);
        }
    }, [loadPaginatedGuests, selectedPartner]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-12">
            
            {/* Encabezado */}
            <div className="flex flex-col justify-between items-start gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">group_add</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Gestión de Invitados
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Búsqueda de socios, registro de visitas y visualización del historial de invitados.</p>
                    </div>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative z-20 w-full">
                <InputSearch<Partner>
                    label="Buscar Socio para Invitados"
                    placeholder="Buscar por nombre, cédula o número de acción..."
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    isLoading={isPartnersLoading}
                    isFiltering={isFiltering}
                    isDropdownOpen={isDropdownOpen}
                    items={filteredItems}
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
            </div>

            {/* Contenido Principal */}
            {selectedPartner ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
                    
                    {/* Tarjeta del Socio Seleccionado e Info */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-4">
                            <span className="material-symbols-rounded text-[1.2em]">person</span>
                            Socio Seleccionado
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 font-bold text-xl ring-4 ring-indigo-50/50">
                                {selectedPartner.acc}
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-xl leading-tight">{selectedPartner.nombre}</p>
                                <p className="text-sm font-semibold text-slate-500 capitalize flex items-center gap-1.5">
                                    <span className="material-symbols-rounded text-[16px]">badge</span>
                                    C.I: {selectedPartner.cedula}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Selector y Contenido de Secciones */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
                            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-rounded text-indigo-500">list_alt</span>
                                Módulo de Invitados
                            </h2>
                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    type="button"
                                    onClick={() => handleSectionChange('ingreso')}
                                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                                        activeSection === 'ingreso'
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }`}
                                >
                                    <span className="material-symbols-rounded text-[18px]">how_to_reg</span>
                                    Ingreso
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSectionChange('lista')}
                                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-2 ${
                                        activeSection === 'lista'
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }`}
                                >
                                    <span className="material-symbols-rounded text-[18px]">history</span>
                                    Historial
                                </button>
                            </div>
                        </div>

                        {/* Contenido Dinámico */}
                        <div className="p-5 sm:p-6 bg-slate-50/30">
                            {activeSection === 'ingreso' ? (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 border-b border-dashed border-slate-200 pb-3">
                                            <span className="material-symbols-rounded text-emerald-500">person_add</span>
                                            Registrar Nuevo Invitado
                                        </h3>
                                        <GuestForm 
                                            onSubmit={handleFormSubmit}
                                            isSubmitting={isSubmitting}
                                            serverErrors={serverErrors}
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <span className="material-symbols-rounded text-indigo-500">event</span>
                                            Invitados del Mes Actual
                                        </h3>
                                        <GuestCurrentList
                                            guests={currentGuests}
                                            isLoading={isCurrentLoading}
                                            error={currentError}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in slide-in-from-left-4 duration-300">
                                    <GuestHistoryList
                                        paginatedGuests={paginatedGuests}
                                        isLoading={isPaginatedLoading}
                                        error={paginatedError}
                                        onPageChange={handleHistoryPageChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center animate-in fade-in duration-500">
                    <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <span className="material-symbols-rounded text-5xl">group</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Seleccione un Socio</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Utilice el buscador para seleccionar un socio, registrar nuevos invitados y ver su historial de visitas.
                    </p>
                </div>
            )}

            <PaymentFeedbackModal
                isOpen={modalConfig.isOpen}
                variant={modalConfig.variant}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </div>
    );
};
