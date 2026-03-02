// hooks/usePartnerForm.ts
import { useState } from 'react';
import { partnerService } from '../service/partnerService';
import type { Partner } from '../types/partnerResponseType';
import { useToast } from "@/contexts/ToastContext.tsx";
import type { PartnerFormValues } from '../schemas/partnerSchema';

export const usePartnerForm = (initialPartner: Partner | null, onSaveSuccess: (partner: Partner) => void) => {
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    // Ahora recibe directamente la data ya procesada por RHF/Zod
    const handleSave = async (data: PartnerFormValues) => {
        if (!initialPartner) return;
        setIsSaving(true);
        try {
            const mappedData: Partial<Partner> = {
                ...data,
                cedula: Number(data.cedula)
            };

            // Se le envían los datos validados al backend
            const updated = await partnerService.update(initialPartner.acc, mappedData);
            onSaveSuccess(updated);
            showToast("¡El socio ha sido modificado correctamente!", 'success');
            return updated;
        } catch (error) {
            showToast("Error al actualizar los datos", 'error');
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    return { isSaving, handleSave };
};