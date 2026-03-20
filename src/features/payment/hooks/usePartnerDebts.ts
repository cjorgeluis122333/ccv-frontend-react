import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import type { Debt, PartnerInfo } from '../types/paymentTypes';

export const usePartnerDebts = () => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
    const [totalDebts, setTotalDebts] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDebts = useCallback(async (acc: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await paymentService.getPartnerDebts(acc);
            setDebts(data.data.resumen_deudas || []);
            setPartnerInfo(data.data.socio || null);
            setTotalDebts(data.data.total_a_pagar || 0);
        } catch (err: any) {
            console.error('Error fetching partner debts', err);
            setError(err?.response?.data?.message || 'Error al cargar las deudas del socio');
            setDebts([]);
            setPartnerInfo(null);
            setTotalDebts(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearDebts = useCallback(() => {
        setDebts([]);
        setPartnerInfo(null);
        setTotalDebts(0);
        setError(null);
    }, []);

    return {
        debts,
        partnerInfo,
        totalDebts,
        isLoading,
        error,
        loadDebts,
        clearDebts
    };
};
