import api from '@/lib/axios';
import type { Guest, GuestPaginatedResponse, GuestPayload, RegisteredGuest } from '../types/guestTypes';

export const guestService = {
    // Ingreso - Obtener invitados del mes
    getCurrentMonthGuests: async (acc: number): Promise<{ status: string; message: string; data: Guest[] }> => {
        const response = await api.get(`/guest-current/${acc}`);
        return response.data;
    },

    // Ingreso - Registrar nuevo invitado
    registerGuest: async (payload: GuestPayload): Promise<{ status: string; message: string; data: Guest }> => {
        const response = await api.post('/guest', payload);
        return response.data;
    },

    // Lista - Obtener invitados paginados por año/mes
    getGuestsPaginated: async (acc: number, page: number = 1): Promise<{ success: boolean; data: GuestPaginatedResponse }> => {
        const response = await api.get(`/guest/${acc}`, {
            params: { page }
        });
        return response.data;
    },

    // Catálogo - Obtener todos los invitados registrados
    getGuestCatalog: async (): Promise<{ status: string; message: string; data: RegisteredGuest[] }> => {
        const response = await api.get('/register-guest');
        return response.data;
    }
};
