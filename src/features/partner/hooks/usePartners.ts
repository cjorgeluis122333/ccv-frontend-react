import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PaginatedResponse } from "@/types/paginationResponseTypes.ts";
import type { Partner } from "@/features/partner/types/partnerResponseType.ts";
import { partnerService } from "@/features/partner/service/partnerService.ts";

export const usePartners = () => {
    const [data, setData] = useState<PaginatedResponse<Partner> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPartners = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await partnerService.getAll({ page, per_page: 1500 });
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

    // Filtrado local por búsqueda
    const filteredPartners = useMemo(() => {
        const partners = data?.data || [];
        if (!searchTerm.trim()) return partners;

        const term = searchTerm.toLowerCase().trim();
        return partners.filter(partner =>
            partner.nombre.toLowerCase().includes(term) ||
            partner.cedula.toString().includes(term) ||
            partner.acc.toString().includes(term) ||
            (partner.correo && partner.correo.toLowerCase().includes(term)) ||
            (partner.telefono && partner.telefono.includes(term))
        );
    }, [data?.data, searchTerm]);

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
        partners: filteredPartners,
        allPartners: data?.data || [],
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
        searchTerm,
        setSearchTerm,
        refresh: fetchPartners
    };
};
