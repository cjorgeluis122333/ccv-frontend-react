import { useState } from 'react';
import { usePartners } from '@/features/partner/hooks/usePartners';
import { useSearchGeneric } from "@/hooks/search/useSearchPartner.ts";
import { useGenericFilter } from "@/hooks/search/useGenericFilter.ts";
import { InputSearch } from "@/components/input/InputSearch.tsx";
import type { Partner } from '@/features/partner/types/partnerResponseType';

import { usePartnerDebts } from '../hooks/usePartnerDebts';
import { usePaymentFeature } from '../hooks/usePaymentFeature';
import { DebtList } from '../components/DebtList';
import { PaymentForm } from '../components/PaymentForm';
import { paymentService } from '../services/paymentService';
import type { PaymentFormValues } from '../schemas/paymentSchema';
import { PaymentFeedbackModal } from '../components/PaymentFeedbackModal';
// Assume UserInfo is from a context, hardcoded for now or adjust based on your auth
const mockUserInfo = { name: "Jorge" };

export const PaymentScreen = () => {
    const { partners: allPartners, searchTerm, setSearchTerm, isLoading: isPartnersLoading } = usePartners();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    // Feature Hooks
    const { 
        debts, 
        partnerInfo, 
        isLoading: isDebtsLoading, 
        loadDebts, 
        clearDebts 
    } = usePartnerDebts();

    const {
        selectedDebts,
        toggleDebtSelection,
        clearSelection,
        hasSelection,
        totalSelectedAmount,
        generateDescription,
        calculateDistribution,
        buildPayload
    } = usePaymentFeature(mockUserInfo);

    // Modals & States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, isSuccess: false, message: '' });
    const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

    // Search Configuration
    const {
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        handleSearchChange
    } = useSearchGeneric(setSearchTerm, () => {
        setSelectedPartner(null);
        clearDebts();
        clearSelection();
    });

    const { filteredItems, isFiltering } = useGenericFilter<Partner>({
        items: allPartners,
        searchTerm: searchTerm,
        filterFn: (p, term) => {
            const nombre = p.nombre?.toLowerCase() || "";
            const acc = String(p.acc || "");
            const cedula = String(p.cedula || "");
            return nombre.includes(term) || acc.includes(term) || cedula.includes(term);
        }
    });

    const handleSelectPartner = (partner: Partner) => {
        setSelectedPartner(partner);
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);
        clearSelection();
        loadDebts(partner.acc);
    };

    const handlePaymentSubmit = async (data: PaymentFormValues) => {
        if (!selectedPartner) return;

        setIsSubmitting(true);
        setServerErrors(undefined);

        // Fallback for manual exact month (if not provided, it uses first day via our util when doing manual mode, but form has 'yyyy-mm')
        const manualMonth = hasSelection ? undefined : data.fecha_pago; 
        
        try {
            const payload = buildPayload(data, selectedPartner.acc, manualMonth);
            const response = await paymentService.processPayment(payload);
            
            setModalConfig({
                isOpen: true,
                isSuccess: true,
                message: response?.message || "Pago procesado exitosamente."
            });
            
            // Reload debts and clear selection on success
            clearSelection();
            loadDebts(selectedPartner.acc);

        } catch (error: any) {
            console.error("Payment error:", error);
            const status = error?.response?.status;
            
            if (status === 422) {
                // Validation error exactly as requested
                setServerErrors(error.response.data.errors);
                setModalConfig({
                    isOpen: true,
                    isSuccess: false,
                    message: error.response.data.message || "Los datos proporcionados no son válidos."
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    isSuccess: false,
                    message: "Ocurrió un error inesperado al procesar el pago."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex flex-col justify-between items-start gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">payments</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Gestión de Pagos
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Búsqueda de socios, visualización de deudas y procesamiento de pagos.</p>
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="relative z-20 w-full">
                <InputSearch<Partner>
                    label="Buscar Socio para Pago"
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
                    keyExtractor={(p) => p.acc}
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

            {/* Layout Principal: Lista de Deudas y Formulario */}
            {selectedPartner && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
                    
                    {/* Columna Izquierda: Detalles del Socio y Deudas */}
                    <div className="xl:col-span-5 space-y-6">
                        {/* Tarjeta Simple de Info */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                             <h3 className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-4">
                                <span className="material-symbols-rounded text-[1.2em]">person</span>
                                Socio Seleccionado
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 font-bold text-lg">
                                    {partnerInfo ? partnerInfo.acc : selectedPartner.acc}
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-lg leading-tight">{partnerInfo ? partnerInfo.nombre : selectedPartner.nombre}</p>
                                    <p className="text-sm font-semibold text-slate-500 capitalize">{partnerInfo?.categoria || 'Titular'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lista de Deudas */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                                <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-rounded text-rose-500">receipt_long</span>
                                    Deudas Pendientes
                                </h2>
                                {!isDebtsLoading && (
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        Total: ${totalSelectedAmount.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <div className="p-5 bg-slate-50/40">
                                <DebtList 
                                    debts={debts} 
                                    selectedDebts={selectedDebts}
                                    onToggleDebt={toggleDebtSelection} 
                                    isLoading={isDebtsLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario */}
                    <div className="xl:col-span-7">
                        {/* Se pasa calculatedAbono 0 inicialmente, ya que el form maneja su propio estado interno de monto_pagado. 
                            Podríamos pasarle el callback para calcular o que el form lo calcule dentro si le pasamos calculateDistribution 
                        */}
                        {(() => {
                            // Dummy wrapper if you want dynamic abono based on form value, we can lift it but wait, 
                            // The form component handles `watch('monto_pagado')`. Let's create a functional wrapper 
                            // inside or just rely on passing it inside if we update PaymentForm. 
                            // Wait, I designed it so PaymentForm is a completely isolated component that takes `calculatedAbono` as prop.
                            // But `calculatedAbono` needs to react to `monto_pagado` which is inside `useForm`.
                            // Mejor dejemos que el form sea tonto y levante el state? Oh, useForm está en PaymentForm.
                            return null;
                        })()}
                        
                        {/* To fix the dynamic `abono`, I will just pass `calculateDistribution` as a prop implicitly by modifying PaymentForm 
                         * Or doing a small refactor: lifting hook form up. But wait, I've already written PaymentForm. 
                         * I will just pass it 0 for now and let the user know, or I can quickly update PaymentForm to take `calculateOpciones`.
                         * Let's change `PaymentForm` to calculate abono internally or pass `calculateDistribution` directly to it.
                        */}
                         <PaymentForm
                            calculateDistribution={calculateDistribution}
                            totalSelectedAmount={totalSelectedAmount}
                            descriptionFromSelection={generateDescription()}
                            hasSelection={hasSelection}
                            selectedDebts={selectedDebts}
                            onSubmit={handlePaymentSubmit}
                            isSubmitting={isSubmitting}
                            serverErrors={serverErrors}
                        />
                    </div>
                </div>
            )}

            {!selectedPartner && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center animate-in fade-in duration-500">
                    <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <span className="material-symbols-rounded text-5xl">payments</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Seleccione un Socio</h2>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Utilice el buscador para seleccionar un socio, ver sus deudas y procesar un pago o abono.
                    </p>
                </div>
            )}

            <PaymentFeedbackModal 
                isOpen={modalConfig.isOpen}
                isSuccess={modalConfig.isSuccess}
                message={modalConfig.message}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </div>
    );
};
