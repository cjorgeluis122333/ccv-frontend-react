import { useState, useCallback } from 'react';
import { partnerService } from '@/features/partner/service/partnerService';
import type { HistoryItem } from '@/features/partner/types/partnerResponseType';

export const usePartnerHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [errorHistory, setErrorHistory] = useState<string | null>(null);

    const loadHistory = useCallback(async (acc: number) => {
        setIsLoadingHistory(true);
        setErrorHistory(null);
        try {
            const response = await partnerService.getHistory(acc);
            if (response.status === 'success') {
                setHistory(response.data);
            } else {
                setErrorHistory(response.message || 'Error al obtener historial');
            }
        } catch (error: any) {
            console.error('Error fetching partner history:', error);
            setErrorHistory(error.response?.data?.message || 'Error de conexión al cargar el historial.');
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    const resetHistory = useCallback(() => {
        setHistory([]);
        setErrorHistory(null);
    }, []);

    return { history, isLoadingHistory, errorHistory, loadHistory, resetHistory };
};
