import type {
    PartnerAdvanceDebtsResponse,
    PartnerDebtsResponse,
    PaymentPayload
} from '../types/paymentTypes';
import api from '@/lib/axios';

export const paymentService = {
    getPartnerDebts: async (acc: number, adelanto = 0): Promise<PartnerDebtsResponse> => {
        const response = await api.get<PartnerDebtsResponse>(`/partners/debs/${acc}`, {
            params: { adelanto }
        });
        return response.data;
    },

    getPartnerAdvanceDebts: async (acc: number, adelanto = 12): Promise<PartnerAdvanceDebtsResponse> => {
        const response = await api.get<PartnerAdvanceDebtsResponse>(`/partners/debs/advance/${acc}`, {
            params: { adelanto }
        });
        return response.data;
    },

    processPayment: async (payload: PaymentPayload): Promise<any> => {
        const response = await api.post('/history', payload);
        return response.data;
    }
};
