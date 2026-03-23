import { useMemo, useState } from 'react';
import type { Debt, PaymentItemPayload, PaymentPayload } from '../types/paymentTypes';
import { formatToYearMonth } from '@/utils/dateUtils';
import type { PaymentFormValues } from '../schemas/paymentSchema';

type PaymentOperatorInfo = {
    name?: string;
};

export const usePaymentFeature = (userInfo: PaymentOperatorInfo) => {
    const [selectedDebts, setSelectedDebts] = useState<Debt[]>([]);

    const selectSingleDebt = (debt: Debt) => {
        setSelectedDebts([debt]);
    };

    const toggleDebtSelection = (debt: Debt) => {
        setSelectedDebts(prev => {
            const exists = prev.find(d => d.mes === debt.mes);
            if (exists) {
                return prev.filter(d => d.mes !== debt.mes);
            }

            return [...prev, debt].sort((a, b) => a.mes.localeCompare(b.mes));
        });
    };

    const clearSelection = () => setSelectedDebts([]);

    const isSingleSelection = selectedDebts.length === 1;
    const isMultiSelection = selectedDebts.length > 1;
    const hasSelection = selectedDebts.length > 0;

    const totalSelectedAmount = useMemo(() => {
        const total = selectedDebts.reduce((acc, curr) => acc + curr.deuda_pendiente, 0);
        return Number(total.toFixed(2));
    }, [selectedDebts]);

    const generateDescription = (singleMonthSelection?: string) => {
        if (isSingleSelection) {
            return `Monto de la cuota del mes ${selectedDebts[0].mes}`;
        }

        if (isMultiSelection) {
            const months = selectedDebts.map(d => d.mes).join(', ');
            return `Monto de la cuota de los meses ${months}`;
        }

        if (singleMonthSelection) {
            return `Monto de la cuota del mes ${singleMonthSelection}`;
        }

        return '';
    };

    const calculateDistribution = (montoPagado: number) => {
        let remaining = montoPagado;
        const distribution: PaymentItemPayload[] = [];
        const totalDebt = selectedDebts.reduce((sum, debt) => sum + debt.deuda_pendiente, 0);
        const abono = montoPagado > totalDebt ? Number((montoPagado - totalDebt).toFixed(2)) : 0;

        if (isSingleSelection) {
            const debt = selectedDebts[0];
            return {
                distribution: [{ mes: debt.mes, monto: Math.min(debt.deuda_pendiente, montoPagado) }],
                abono
            };
        }

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

            return {
                distribution,
                abono
            };
        }

        return { distribution: [], abono: 0 };
    };

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
            seniat: 'no',
            operador: userInfo?.name || 'Operador',
            pagos
        };
    };

    return {
        selectedDebts,
        selectSingleDebt,
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
