import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import axios from 'axios';
import { InputSearch } from "@/components/input/InputSearch.tsx";
import { usePartners } from '@/features/partner/hooks/usePartners';
import type { Partner } from '@/features/partner/types/partnerResponseType';
import { useGenericFilter } from "@/hooks/search/useGenericFilter.ts";
import { useSearchGeneric } from "@/hooks/search/useSearchPartner.ts";
import { DebtList } from '../components/DebtList';
import { PaymentFeedbackModal } from '../components/PaymentFeedbackModal';
import { PaymentForm } from '../components/PaymentForm';
import { usePartnerDebts } from '../hooks/usePartnerDebts';
import { usePaymentFeature } from '../hooks/usePaymentFeature';
import type { PaymentFormValues } from '../schemas/paymentSchema';
import { paymentService } from '../services/paymentService';
import type { Debt } from '../types/paymentTypes';

const mockUserInfo = { name: "Jorge" };
const DEFAULT_ADVANCE_MONTHS = '10';

type PaymentModalConfig = {
    isOpen: boolean;
    variant: 'success' | 'error' | 'warning';
    message: string;
    title?: string;
};

type DebtSection = 'current' | 'future';

const normalizeAdvanceMonths = (value: string) => {
    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue) || parsedValue < 0) {
        return 0;
    }

    return parsedValue;
};

export const PaymentScreen = () => {
    const { partners: allPartners, searchTerm, setSearchTerm, isLoading: isPartnersLoading } = usePartners();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [activeSection, setActiveSection] = useState<DebtSection>('current');
    const [advanceMonthsInput, setAdvanceMonthsInput] = useState(DEFAULT_ADVANCE_MONTHS);
    const [debouncedAdvanceMonths, setDebouncedAdvanceMonths] = useState(0);

    const {
        currentDebts,
        futureDebts,
        partnerInfo,
        childrenOver30,
        isCurrentLoading,
        isFutureLoading,
        currentError,
        futureError,
        loadCurrentDebts,
        loadFutureDebts,
        invalidatePartnerCache,
        clearDebts
    } = usePartnerDebts();

    const {
        selectedDebts,
        selectSingleDebt,
        toggleDebtSelection,
        clearSelection,
        hasSelection,
        totalSelectedAmount,
        generateDescription,
        calculateDistribution,
        buildPayload
    } = usePaymentFeature(mockUserInfo);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalConfig, setModalConfig] = useState<PaymentModalConfig>({
        isOpen: false,
        variant: 'success',
        message: '',
        title: undefined
    });
    const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

    const normalizedAdvanceMonths = useMemo(
        () => normalizeAdvanceMonths(advanceMonthsInput),
        [advanceMonthsInput]
    );

    const handleSearchReset = useCallback(() => {
        setSelectedPartner(null);
        setActiveSection('current');
        setAdvanceMonthsInput(DEFAULT_ADVANCE_MONTHS);
        clearDebts();
        clearSelection();
    }, [clearDebts, clearSelection]);

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

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedAdvanceMonths(normalizedAdvanceMonths);
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [normalizedAdvanceMonths]);

    useEffect(() => {
        if (!selectedPartner || activeSection !== 'future') {
            return;
        }

        clearSelection();
        void loadFutureDebts(selectedPartner.acc, debouncedAdvanceMonths);
    }, [
        activeSection,
        clearSelection,
        debouncedAdvanceMonths,
        loadFutureDebts,
        selectedPartner
    ]);

    const displayedDebts = useMemo(
        () => activeSection === 'current' ? currentDebts : futureDebts,
        [activeSection, currentDebts, futureDebts]
    );

    const isDebtsLoading = activeSection === 'current' ? isCurrentLoading : isFutureLoading;
    const debtsError = activeSection === 'current' ? currentError : futureError;
    const emptyDebtState = activeSection === 'current'
        ? {
            title: 'Al dia',
            message: 'El socio no presenta deudas pendientes.'
        }
        : {
            title: 'Sin deudas futuras',
            message: 'No hay deudas futuras para el adelanto indicado.'
        };

    const handleSelectPartner = useCallback((partner: Partner) => {
        setSelectedPartner(partner);
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);
        setActiveSection('current');
        setAdvanceMonthsInput(DEFAULT_ADVANCE_MONTHS);
        clearSelection();
        void loadCurrentDebts(partner.acc);
    }, [clearSelection, loadCurrentDebts, setIsDropdownOpen, setSearchTerm]);

    const handleAutoSelectDebtByMonth = useCallback((month: string) => {
        const matchingDebt = displayedDebts.find((debt: Debt) => debt.mes === month);
        if (matchingDebt) {
            selectSingleDebt(matchingDebt);
        }
    }, [displayedDebts, selectSingleDebt]);

    const handleSectionChange = useCallback((section: DebtSection) => {
        setActiveSection(section);
        clearSelection();

        if (section === 'current' && selectedPartner) {
            void loadCurrentDebts(selectedPartner.acc);
        }
    }, [clearSelection, loadCurrentDebts, selectedPartner]);

    const handleAdvanceMonthsChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        if (nextValue === '' || /^\d+$/.test(nextValue)) {
            setAdvanceMonthsInput(nextValue);
        }
    }, []);

    const handlePaymentSubmit = async (data: PaymentFormValues) => {
        if (!selectedPartner) return;

        const paymentAmount = Number(data.monto_pagado || 0);

        if (hasSelection && paymentAmount > totalSelectedAmount) {
            const extraAmount = Number((paymentAmount - totalSelectedAmount).toFixed(2));
            setModalConfig({
                isOpen: true,
                variant: 'warning',
                title: 'Monto mayor al total',
                message: `El monto ingresado excede el total seleccionado. El extra pagado es de $${extraAmount.toFixed(2)} y ese valor corresponde al abono.`
            });
            return;
        }

        setIsSubmitting(true);
        setServerErrors(undefined);

        const manualMonth = hasSelection ? undefined : data.fecha_pago;

        try {
            const payload = buildPayload(data, selectedPartner.acc, manualMonth);
            const response = await paymentService.processPayment(payload);

            setModalConfig({
                isOpen: true,
                variant: 'success',
                title: 'Pago Completado',
                message: response?.message || "Pago procesado exitosamente."
            });

            clearSelection();
            invalidatePartnerCache(selectedPartner.acc);

            await Promise.all([
                loadCurrentDebts(selectedPartner.acc, { force: true }),
                activeSection === 'future'
                    ? loadFutureDebts(selectedPartner.acc, debouncedAdvanceMonths, { force: true })
                    : Promise.resolve(null)
            ]);
        } catch (error: unknown) {
            console.error("Payment error:", error);
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            const responseMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
            const responseErrors = axios.isAxiosError(error) ? error.response?.data?.errors : undefined;

            if (status === 422) {
                setServerErrors(responseErrors);
                setModalConfig({
                    isOpen: true,
                    variant: 'error',
                    title: 'Error en el Pago',
                    message: responseMessage || "Los datos proporcionados no son validos."
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    variant: 'error',
                    title: 'Error en el Pago',
                    message: "Ocurrio un error inesperado al procesar el pago."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-12">
            <div className="flex flex-col justify-between items-start gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">payments</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Gestion de Pagos
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Busqueda de socios, visualizacion de deudas y procesamiento de pagos.</p>
                    </div>
                </div>
            </div>

            <div className="relative z-20 w-full">
                <InputSearch<Partner>
                    label="Buscar Socio para Pago"
                    placeholder="Buscar por nombre, cedula o numero de accion..."
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

            {selectedPartner && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10">
                    <div className="xl:col-span-5 space-y-6">
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

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/80 space-y-4">
                                <div className="flex justify-between items-center gap-4">
                                    <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-rounded text-rose-500">receipt_long</span>
                                        Historial de Deudas
                                    </h2>
                                    {!isDebtsLoading && (
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            Seleccionado: ${totalSelectedAmount.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSectionChange('current')}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                            activeSection === 'current'
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                    >
                                        Hasta el mes actual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSectionChange('future')}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                            activeSection === 'future'
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                    >
                                        Deudas futuras
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 bg-slate-50/40 space-y-4">
                                <DebtList
                                    debts={displayedDebts}
                                    selectedDebts={selectedDebts}
                                    onToggleDebt={toggleDebtSelection}
                                    isLoading={isDebtsLoading}
                                    error={debtsError}
                                    emptyTitle={emptyDebtState.title}
                                    emptyMessage={emptyDebtState.message}
                                />

                                {activeSection === 'future' && (
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-rounded text-[1.2em]">schedule</span>
                                                Meses por adelanto
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                inputMode="numeric"
                                                value={advanceMonthsInput}
                                                onChange={handleAdvanceMonthsChange}
                                                placeholder="0"
                                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Este valor se envia como parametro <code>adelanto</code> al listar las deudas futuras.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h3 className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                    <span className="material-symbols-rounded text-[1.2em]">groups</span>
                                    Hijos Mayores de 30
                                </h3>
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    {childrenOver30.length}
                                </span>
                            </div>

                            {isCurrentLoading && !partnerInfo ? (
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 border-dashed bg-slate-50 p-4 text-slate-500">
                                    <span className="material-symbols-rounded text-indigo-400 animate-spin">progress_activity</span>
                                    <p className="text-sm font-medium">Cargando informacion complementaria...</p>
                                </div>
                            ) : childrenOver30.length === 0 ? (
                                <div className="rounded-xl border border-slate-200 border-dashed bg-slate-50 p-4 text-sm font-medium text-slate-500">
                                    No tiene socio numero.
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {childrenOver30.map((childName) => (
                                        <li
                                            key={childName}
                                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                                        >
                                            <span className="material-symbols-rounded text-indigo-500">person</span>
                                            <span className="text-sm font-semibold text-slate-700 capitalize">
                                                {childName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="xl:col-span-7">
                        <PaymentForm
                            debts={displayedDebts}
                            calculateDistribution={calculateDistribution}
                            totalSelectedAmount={totalSelectedAmount}
                            descriptionFromSelection={generateDescription()}
                            hasSelection={hasSelection}
                            selectedDebts={selectedDebts}
                            onAutoSelectDebtByMonth={handleAutoSelectDebtByMonth}
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
                variant={modalConfig.variant}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </div>
    );
};
