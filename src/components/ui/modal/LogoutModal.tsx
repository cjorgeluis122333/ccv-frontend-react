// src/components/ui/LogoutModal.tsx
import { useEffect } from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }: LogoutModalProps) => {
    // Evitar scroll cuando el modal está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop con Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Contenido del Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-rounded text-2xl">logout</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        ¿Cerrar Sesión?
                    </h3>

                    <p className="text-sm text-slate-500 mb-6">
                        Estás a punto de salir del sistema. Tendrás que ingresar tus credenciales nuevamente para acceder.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <span className="material-symbols-rounded animate-spin text-base">progress_activity</span>
                            )}
                            {isLoading ? 'Saliendo...' : 'Sí, Salir'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
