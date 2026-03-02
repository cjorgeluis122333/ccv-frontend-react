import { useState, useCallback } from 'react';
import { partnerService } from '@/features/partner/service/partnerService';
import type { HistoryItem } from '@/features/partner/types/partnerResponseType';
import type { PaginatedResponse } from '@/types/paginationResponseTypes';

export const usePartnerHistory = () => {
    const [historyData, setHistoryData] = useState<PaginatedResponse<HistoryItem> | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [errorHistory, setErrorHistory] = useState<string | null>(null);

    const loadHistory = useCallback(async (acc: number, page: number = 1) => {
        setIsLoadingHistory(true);
        setErrorHistory(null);
        try {
            const response = await partnerService.getHistory(acc, page);
            // La nueva API devuelve el PaginatedResponse directo
            setHistoryData(response);
        } catch (error: any) {
            console.error('Error fetching partner history:', error);
            setErrorHistory(error.response?.data?.message || 'Error de conexión al cargar el historial.');
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    const resetHistory = useCallback(() => {
        setHistoryData(null);
        setErrorHistory(null);
    }, []);

    return { historyData, isLoadingHistory, errorHistory, loadHistory, resetHistory };
};
