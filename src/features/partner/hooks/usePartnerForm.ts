// hooks/usePartnerForm.ts
import { useState, useMemo, useEffect } from 'react';
import { partnerService } from '../service/partnerService';
import type { Partner } from '../types/partnerResponseType';

export const usePartnerForm = (
    selectedPartner: Partner | null,
    onUpdateSuccess: (updatedPartner: Partner) => void
) => {
    const [formData, setFormData] = useState<Partial<Partner>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Inicializar form data cuando cambia el socio
    useEffect(() => {
        if (selectedPartner) {
            setFormData(selectedPartner);
        }
    }, [selectedPartner]);

    // Limpiar alertas
    useEffect(() => {
        if (saveStatus) {
            const timer = setTimeout(() => setSaveStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleInputChange = (field: keyof Partner, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const hasChanges = useMemo(() => {
        if (!selectedPartner) return false;
        return Object.keys(formData).some((key) => {
            const k = key as keyof Partner;
            const formVal = formData[k] || '';
            const originalVal = selectedPartner[k] || '';
            return formVal !== originalVal;
        });
    }, [formData, selectedPartner]);

    const handleSave = async () => {
        if (!selectedPartner || !hasChanges) return;

        setIsSaving(true);
        setSaveStatus(null);

        try {
            const updatedPartner = await partnerService.update(selectedPartner.acc, formData);
            setFormData(updatedPartner);
            setSaveStatus({ type: 'success', message: 'Datos actualizados correctamente' });
            onUpdateSuccess(updatedPartner); // Notificar al padre
        } catch (error) {
            console.error(error);
            setSaveStatus({ type: 'error', message: 'Error al actualizar los datos del socio' });
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        isSaving,
        saveStatus,
        hasChanges,
        handleInputChange,
        handleSave,
        setSaveStatus // Exponemos esto por si el padre necesita limpiarlo al cambiar de socio
    };
};