// hooks/usePartnerForm.ts
import { useState, useMemo, useEffect } from 'react';
import { partnerService } from '../service/partnerService';
import type { Partner } from '../types/partnerResponseType';

export const usePartnerForm = (initialPartner: Partner | null, onSaveSuccess: (partner: Partner) => void) => {
    const [formData, setFormData] = useState<Partial<Partner>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Autolimpiar alertas
    useEffect(() => {
        if (saveStatus) {
            const timer = setTimeout(() => setSaveStatus(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    // NUEVO: Función para forzar la sincronización inmediata
    const resetForm = (partner: Partner | null) => {
        setFormData(partner || {});
        setSaveStatus(null);
    };

    const handleInputChange = (field: keyof Partner, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const hasChanges = useMemo(() => {
        if (!initialPartner) return false;
        return Object.keys(formData).some((key) => {
            const k = key as keyof Partner;
            return (formData[k] || '') !== (initialPartner[k] || '');
        });
    }, [formData, initialPartner]);

    const handleSave = async () => { // Renombrado a handleSave para coincidir con tu UI
        if (!initialPartner || !hasChanges) return;
        setIsSaving(true);
        try {
            const updated = await partnerService.update(initialPartner.acc, formData);
            setSaveStatus({ type: 'success', message: 'Datos actualizados correctamente' });
            onSaveSuccess(updated); // Pasamos el actualizado
            return updated;
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Error al actualizar los datos' });
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    // Exportamos resetForm y setSaveStatus
    return { formData, setFormData, handleInputChange, hasChanges, isSaving, saveStatus, handleSave, resetForm };
};