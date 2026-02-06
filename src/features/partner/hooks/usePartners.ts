import { useState, useEffect, useCallback } from 'react';
import type {PaginatedResponse} from "@/types/paginationResponseTypes.ts";
import type {Partner} from "@/features/partner/types/partnerResponseType.ts";
import {partnerService} from "@/features/partner/service/partnerService.ts";

export const usePartners = () => {
    const [data, setData] = useState<PaginatedResponse<Partner> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const fetchPartners = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await partnerService.getAll({ page, per_page: 50 });
            setData(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar la lista de socios.');
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    // Funciones para manejar la paginación
    const nextPage = () => {
        if (data && data.current_page < data.last_page) {
            setPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return {
        partners: data?.data || [],
        pagination: data ? {
            currentPage: data.current_page,
            lastPage: data.last_page,
            total: data.total,
            from: data.from,
            to: data.to
        } : null,
        isLoading,
        error,
        nextPage,
        prevPage,
        setPage,
        refresh: fetchPartners
    };
};