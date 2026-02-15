import React, { useState, useCallback, type ReactNode } from 'react';
import { Toast } from '@/components/ui/toast/Toast.tsx';
import {ToastContext, type ToastMessage, type ToastType} from "@/contexts/ToastContext.tsx";

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = { id, message, type, duration };

        setToasts((prev) => [...prev, newToast]);
        // NOTA IMPORTANTE:
        // Ahora delegamos el cierre al componente <Toast />.
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}

            {/* Contenedor de Toasts (Portal visual) */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => hideToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};