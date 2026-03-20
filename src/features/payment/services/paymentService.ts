import type { PaymentPayload, PartnerDebtsResponse } from '../types/paymentTypes';
import api from '@/lib/axios';

export const paymentService = {
    getPartnerDebts: async (acc: number): Promise<PartnerDebtsResponse> => {
        const response = await api.get<PartnerDebtsResponse>(`/partners/debs/${acc}`);
        return response.data;
    },

    processPayment: async (payload: PaymentPayload): Promise<any> => {
        const response = await api.post('/history', payload);
        return response.data;
    }
};
