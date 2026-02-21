import api from '@/lib/axios';
import type { Partner, PartnerQueryParams } from "@/features/partner/types/partnerResponseType.ts";
import type { PaginatedResponse } from "@/types/paginationResponseTypes.ts";

export const partnerService = {
    getAll: async ({ page = 1, per_page = 50 }: PartnerQueryParams): Promise<PaginatedResponse<Partner>> => {
        // Axios serializa automáticamente los parámetros (page=1&per_page=50)
        const { data } = await api.get<PaginatedResponse<Partner>>('/partners', {
            params: { page, per_page }
        });
        return data;
    },
    update: async (acc: number, partnerData: Partial<Partner>): Promise<Partner> => {
        const { data } = await api.put<{ message: string; partner: Partner }>(`/partners/${acc}`, partnerData);
        return data.partner;
    }
};