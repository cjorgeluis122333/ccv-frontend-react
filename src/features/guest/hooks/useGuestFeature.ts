import { useState, useCallback } from 'react';
import axios from 'axios';
import { guestService } from '../services/guestService';
import type { Guest, GuestPaginatedResponse, GuestPayload } from '../types/guestTypes';

export const useGuestFeature = () => {
    // Current month guests state
    const [currentGuests, setCurrentGuests] = useState<Guest[]>([]);
    const [isCurrentLoading, setIsCurrentLoading] = useState(false);
    const [currentError, setCurrentError] = useState<string | null>(null);

    // Paginated history cache
    const [historyCache, setHistoryCache] = useState<Record<number, GuestPaginatedResponse>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isPaginatedLoading, setIsPaginatedLoading] = useState(false);
    const [paginatedError, setPaginatedError] = useState<string | null>(null);

    // Derived state for the view
    const paginatedGuests = historyCache[currentPage] || null;

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]> | undefined>();

    const loadCurrentMonthGuests = useCallback(async (acc: number) => {
        setIsCurrentLoading(true);
        setCurrentError(null);
        try {
            const response = await guestService.getCurrentMonthGuests(acc);
            setCurrentGuests(response.data || []);
        } catch (error: unknown) {
            console.error('Error loading current month guests:', error);
            if (axios.isAxiosError(error)) {
                setCurrentError(error.response?.data?.message || 'Error al cargar invitados del mes.');
            } else {
                setCurrentError('Ocurrió un error inesperado al cargar invitados del mes.');
            }
            setCurrentGuests([]);
        } finally {
            setIsCurrentLoading(false);
        }
    }, []);

    const loadPaginatedGuests = useCallback(async (acc: number, page: number = 1, force: boolean = false) => {
        // If we already have the page and not forced, just switch the view
        if (historyCache[page] && !force) {
            setCurrentPage(page);
            return;
        }

        setIsPaginatedLoading(true);
        setPaginatedError(null);
        try {
            const response = await guestService.getGuestsPaginated(acc, page);
            if (response.success) {
                setHistoryCache(prev => ({ ...prev, [page]: response.data }));
                setCurrentPage(page);
            } else {
                setPaginatedError('Error al cargar la lista de invitados.');
            }
        } catch (error: unknown) {
            console.error('Error loading paginated guests:', error);
             if (axios.isAxiosError(error)) {
                setPaginatedError(error.response?.data?.message || 'Error al cargar los invitados.');
            } else {
                setPaginatedError('Ocurrió un error inesperado.');
            }
        } finally {
            setIsPaginatedLoading(false);
        }
    }, [historyCache]);

    const registerNewGuest = async (payload: GuestPayload): Promise<boolean> => {
        setIsSubmitting(true);
        setServerErrors(undefined);
        try {
            await guestService.registerGuest(payload);
            return true;
        } catch (error: unknown) {
            console.error('Error registering guest:', error);
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setServerErrors(error.response.data?.errors);
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearGuestData = useCallback(() => {
        setCurrentGuests([]);
        setHistoryCache({});
        setCurrentPage(1);
        setCurrentError(null);
        setPaginatedError(null);
        setServerErrors(undefined);
    }, []);

    return {
        // State
        currentGuests,
        isCurrentLoading,
        currentError,
        
        paginatedGuests,
        isPaginatedLoading,
        paginatedError,

        isSubmitting,
        serverErrors,

        // Actions
        loadCurrentMonthGuests,
        loadPaginatedGuests,
        registerNewGuest,
        clearGuestData
    };
};
