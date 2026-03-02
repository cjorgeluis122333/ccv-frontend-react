import {useToast} from "@/contexts/ToastContext.tsx";
import {useState} from 'react';
import {partnerService} from "@/features/partner/service/partnerService.ts";
import type {FamilyMember} from "@/features/partner/types/partnerResponseType.ts";

export const useFamily = () => {

    const {showToast} = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const updateFamily = async (id: number, familyData: Partial<FamilyMember>) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await partnerService.updateFamily(id, familyData);
            showToast(`¡Familiar actualizado!`, 'success');

        } catch (error) {
            console.error("Error al actualizar familiar:", error);
            showToast('Error de actualización', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {updateFamily,isLoading};

}