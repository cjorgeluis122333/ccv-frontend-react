import { useState, useMemo } from 'react';
import type { Debt, PaymentPayload, PaymentItemPayload } from '../types/paymentTypes';
import { formatToYearMonth } from '@/utils/dateUtils';
import type { PaymentFormValues } from '../schemas/paymentSchema';

export const usePaymentFeature = (userInfo: any) => {
    const [selectedDebts, setSelectedDebts] = useState<Debt[]>([]);

    // Toggling selection
    const toggleDebtSelection = (debt: Debt) => {
        setSelectedDebts(prev => {
            const exists = prev.find(d => d.mes === debt.mes);
            if (exists) {
                return prev.filter(d => d.mes !== debt.mes);
            } else {
                return [...prev, debt].sort((a, b) => a.mes.localeCompare(b.mes)); // Sort chronological
            }
        });
    };

    const clearSelection = () => setSelectedDebts([]);

    // Derived values based on selection
    const isSingleSelection = selectedDebts.length === 1;
    const isMultiSelection = selectedDebts.length > 1;
    const hasSelection = selectedDebts.length > 0;

    const totalSelectedAmount = useMemo(() => {
        const total = selectedDebts.reduce((acc, curr) => acc + curr.deuda_pendiente, 0);
        return Number(total.toFixed(2));
    }, [selectedDebts]);

    // Generate automatic description based on selection
    const generateDescription = (singleMonthSelection?: string) => {
        if (isSingleSelection) {
            return `Monto de la cuota del mes ${selectedDebts[0].mes}`;
        } else if (isMultiSelection) {
            const months = selectedDebts.map(d => d.mes).join(', ');
            return `Monto de la cuota de los meses ${months}`;
        } else if (singleMonthSelection) {
            return `Monto de la cuota del mes ${singleMonthSelection}`;
        }
        return '';
    };

    // Calculate Abono and Debt Distribution
    // This is useful for previewing how the entered amount distributes over selected debts
    const calculateDistribution = (montoPagado: number) => {
        let remaining = montoPagado;
        const distribution: PaymentItemPayload[] = [];
        // El abono es "cuanto le quedará de deuda de ese mes en dependencia del monto insertado"
        // Según requerimiento: "Abono: Double -> No sera modificable solo sera un numero que mostrara cuanto le quedara de la deuda de ese mes en dependencia del monto insertado"
        
        // Si hay una sola deuda
        if (isSingleSelection) {
            const debt = selectedDebts[0];
            const remainingDebt = debt.deuda_pendiente - montoPagado;
            return {
                distribution: [{ mes: debt.mes, monto: montoPagado }],
                abono: remainingDebt > 0 ? remainingDebt : 0 
            };
        }
        
        // Si hay múltiples
        if (isMultiSelection) {
           for (const debt of selectedDebts) {
               if (remaining <= 0) break;
               
               const payForThisMonth = Math.min(debt.deuda_pendiente, remaining);
               distribution.push({
                   mes: debt.mes,
                   monto: payForThisMonth
               });
               remaining -= payForThisMonth;
           }
           
           // El abono sería la suma de deudas pendientes menos lo pagado
           const totalDebt = selectedDebts.reduce((sum, d) => sum + d.deuda_pendiente, 0);
           const remainingDebt = totalDebt - montoPagado;
           
           return {
               distribution,
               abono: remainingDebt > 0 ? remainingDebt : 0
           };
        }

        // Modo manual (sin selección), asumimos que el mes lo pone el usuario
        return { distribution: [], abono: 0 };
    };

    // Prepare Payload
    const buildPayload = (
        data: PaymentFormValues, 
        acc: number, 
        manualMonth?: string
    ): PaymentPayload => {

        const { distribution } = calculateDistribution(data.monto_pagado);
        let pagos: PaymentItemPayload[] = [];

        if (hasSelection) {
            pagos = distribution;
        } else if (manualMonth) {
            pagos = [{
                mes: formatToYearMonth(manualMonth),
                monto: data.monto_pagado
            }];
        }

        return {
            acc,
            time: Math.floor(Date.now() / 1000).toString(),
            oper: data.operacion,
            resibo: data.recibo,
            control: null,
            factura: null,
            descript: data.descripcion,
            observaciones: data.observaciones || null,
            seniat: "no",
            operador: userInfo?.name || "Operador", // Reemplazar con nombre real
            pagos
        };
    };

    return {
        selectedDebts,
        toggleDebtSelection,
        clearSelection,
        isSingleSelection,
        isMultiSelection,
        hasSelection,
        totalSelectedAmount,
        generateDescription,
        calculateDistribution,
        buildPayload
    };
};
