import { useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { SmartInput } from "@/components/input/SmartInput";
import { paymentSchema, type PaymentFormValues } from "../schemas/paymentSchema";
import type { Debt } from "../types/paymentTypes";

interface PaymentFormProps {
    debts: Debt[];
    totalSelectedAmount: number;
    descriptionFromSelection: string;
    hasSelection: boolean;
    selectedDebts: Debt[];
    calculateDistribution: (monto: number) => { abono: number };
    onAutoSelectDebtByMonth: (month: string) => void;
    onSubmit: (data: PaymentFormValues) => void;
    isSubmitting: boolean;
    serverErrors?: Record<string, string[]>;
}

const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

export const PaymentForm = ({
    debts,
    totalSelectedAmount,
    descriptionFromSelection,
    hasSelection,
    selectedDebts,
    calculateDistribution,
    onAutoSelectDebtByMonth,
    onSubmit,
    isSubmitting,
    serverErrors
}: PaymentFormProps) => {
    const previousHasSelectionRef = useRef(hasSelection);
    const skipAutoSelectRef = useRef(false);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        control,
        formState: { errors }
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            monto_pagado: 0,
            operacion: "pago",
            descripcion: "",
            recibo: "",
            fecha_pago: "",
            observaciones: ""
        }
    });

    const operacionValue = useWatch({ control, name: "operacion" });
    const montoPagadoValue = useWatch({ control, name: "monto_pagado" }) || 0;
    const fechaPagoValue = useWatch({ control, name: "fecha_pago" }) || "";
    const { abono: calculatedAbono } = calculateDistribution(montoPagadoValue);


    const isMultiSelection = selectedDebts.length > 1;
    const roundedTotal = Number(totalSelectedAmount.toFixed(2));
    const montoTotalVisual = hasSelection ? roundedTotal : montoPagadoValue;
    const sortedSelectedDebts = [...selectedDebts].sort((a, b) => b.mes.localeCompare(a.mes));
    const formattedDates = selectedDebts.map(d => d.mes).join(", ");
    const displayDates = formattedDates.length > 35
        ? formattedDates.substring(0, 32) + "..."
        : formattedDates;

    const impuesto = selectedDebts.length > 0 ? (selectedDebts[0].impuesto || 16) : 16;
    const subTotalVisual = montoTotalVisual / (1 + (impuesto / 100));

    const matchingDebtByMonth = useMemo(
        () => debts.find(debt => debt.mes === fechaPagoValue),
        [debts, fechaPagoValue]
    );

    const manualDateError = useMemo(() => {
        if (hasSelection || !fechaPagoValue) {
            return "";
        }

        if (matchingDebtByMonth) {
            return "";
        }

        if (fechaPagoValue <= getCurrentYearMonth()) {
            return "El socio no tiene una deuda registrada en esa fecha.";
        }

        return "";
    }, [fechaPagoValue, hasSelection, matchingDebtByMonth]);

    useEffect(() => {
        if (hasSelection) {
            setValue("monto_pagado", roundedTotal);
            setValue("descripcion", descriptionFromSelection);
            setValue("fecha_pago", selectedDebts[0].mes);
        } else if (previousHasSelectionRef.current) {
            skipAutoSelectRef.current = true;
            setValue("monto_pagado", 0);
            setValue("descripcion", "");
            setValue("fecha_pago", "");
            clearErrors("fecha_pago");
        }

        previousHasSelectionRef.current = hasSelection;
    }, [
        clearErrors,
        descriptionFromSelection,
        hasSelection,
        roundedTotal,
        selectedDebts,
        setValue
    ]);

    useEffect(() => {
        if (skipAutoSelectRef.current) {
            if (!fechaPagoValue) {
                skipAutoSelectRef.current = false;
            }
            return;
        }

        if (hasSelection || !fechaPagoValue) {
            if (!hasSelection) {
                setValue("descripcion", "");
                clearErrors("fecha_pago");
            }
            return;
        }

        if (matchingDebtByMonth) {
            clearErrors("fecha_pago");
            onAutoSelectDebtByMonth(matchingDebtByMonth.mes);
            return;
        }

        setValue("descripcion", `Monto de la cuota del mes ${fechaPagoValue}`);

        if (manualDateError) {
            setError("fecha_pago", {
                type: "manual",
                message: manualDateError
            });
            return;
        }

        clearErrors("fecha_pago");
    }, [
        clearErrors,
        fechaPagoValue,
        hasSelection,
        manualDateError,
        matchingDebtByMonth,
        onAutoSelectDebtByMonth,
        setError,
        setValue
    ]);

    const handleFormSubmit = handleSubmit((data) => {
        if (manualDateError) {
            setError("fecha_pago", {
                type: "manual",
                message: manualDateError
            });
            return;
        }

        onSubmit(data);
    });

    return (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-rounded text-indigo-500">payments</span>
                    Formulario de Pago
                </h2>
            </div>

            <div className="p-5 sm:p-6 flex-1 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="material-symbols-rounded text-[1.2em]">calculate</span>
                            Sub-Total
                        </label>
                        <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold text-sm h-[46px] flex items-center cursor-not-allowed">
                            ${subTotalVisual.toFixed(2)}
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="material-symbols-rounded text-[1.2em]">functions</span>
                            Monto Total
                        </label>
                        <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold text-sm h-[46px] flex items-center cursor-not-allowed">
                            ${montoTotalVisual.toFixed(2)}
                        </div>
                    </div>

                    <SmartInput
                        label="Monto Pagado"
                        type="number"
                        step="0.01"
                        error={errors.monto_pagado?.message}
                        {...register("monto_pagado", { valueAsNumber: true })}
                        icon="paid"
                    />

                    <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="material-symbols-rounded text-[1.2em]">savings</span>
                            Abono
                        </label>
                        <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-emerald-600 font-bold text-sm h-[46px] flex items-center shadow-inner cursor-not-allowed">
                            ${calculatedAbono.toFixed(2)}
                        </div>
                    </div>

                    <SmartInput
                        label="Recibo"
                        error={errors.recibo?.message}
                        {...register("recibo")}
                        icon="receipt_long"
                    />

                    {isMultiSelection ? (
                        <div className="space-y-1.5 group">
                            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="material-symbols-rounded text-[1.2em]">calendar_month</span>
                                Fechas Seleccionadas
                            </label>
                            <select
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                value="summary"
                                onChange={() => {}}
                            >
                                <option value="summary">{displayDates}</option>
                                {sortedSelectedDebts.map(d => (
                                    <option key={d.mes} value={d.mes} disabled className="text-slate-400">
                                        - {d.mes}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-4 top-[3.2rem] material-symbols-rounded text-slate-400 pointer-events-none">
                                arrow_drop_down
                            </span>
                        </div>
                    ) : (
                        <SmartInput
                            label="Fecha de Pago"
                            type="month"
                            error={errors.fecha_pago?.message}
                            disabled={hasSelection}
                            {...register("fecha_pago")}
                            icon="calendar_month"
                        />
                    )}
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="material-symbols-rounded text-[1.2em]">tune</span>
                            Operación
                        </label>
                        <select
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all
                                ${errors.operacion ? 'border-rose-300 focus:ring-rose-500/10 focus:border-rose-500 text-rose-600' : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700'}`}
                            {...register("operacion")}
                        >
                            <option value="pago">Pago</option>
                            <option value="descuento">Descuento</option>
                        </select>
                        {errors.operacion && <p className="text-xs font-bold text-rose-500 mt-1">{errors.operacion.message}</p>}
                    </div>

                    {operacionValue === "descuento" && (
                        <div className="md:col-span-2">
                            <SmartInput
                                label="Observaciones"
                                error={errors.observaciones?.message}
                                {...register("observaciones")}
                                icon="note_alt"
                            />
                        </div>
                    )}
                </div>

                {serverErrors && Object.keys(serverErrors).length > 0 && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                            <span className="material-symbols-rounded text-xl">error</span>
                            Errores de validación del servidor:
                        </div>
                        <ul className="list-disc pl-5 text-sm text-rose-600 space-y-1 font-medium">
                            {Object.entries(serverErrors).map(([key, messages]) => (
                                <li key={key}>{messages.join(" ")}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 p-5 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all text-white
                        ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-95"}`}
                >
                    {isSubmitting ? (
                        <span className="material-symbols-rounded text-xl animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-rounded text-xl">payments</span>
                    )}
                    <span>{isSubmitting ? "Procesando..." : "Procesar Pago"}</span>
                </button>
            </div>
        </form>
    );
};
