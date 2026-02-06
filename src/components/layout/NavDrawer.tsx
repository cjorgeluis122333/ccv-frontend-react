import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { menuSections, standaloneLinks } from '@/config/navigation';
import { DrawerGroup, DrawerLink } from './DrawerItems';

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NavDrawer = ({ isOpen, onClose }: NavDrawerProps) => {

    // Bloquear scroll del body cuando el drawer está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            {/* 1. Overlay (Fondo oscuro) */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 backdrop-blur-sm",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* 2. El Drawer en sí (Lado DERECHO) */}
            <aside
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Cabecera del Drawer */}
                <div className="p-6 border-b border-slate-100 flex flex-col items-center bg-slate-50 relative">
                    <button onClick={onClose} className="absolute top-4 left-4 p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-rounded">close</span>
                    </button>

                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                        CCV
                        {/* Aquí iría tu <img src="..." /> */}
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg">Tu Empresa S.A.</h2>
                    <p className="text-xs text-slate-500">Panel de Administración</p>
                </div>

                {/* Cuerpo Scrollable */}
                <div className="flex-1 overflow-y-auto py-4 space-y-1">
                    {/* Secciones Desplegables */}
                    {menuSections.map((section) => (
                        <DrawerGroup key={section.title} section={section} onClose={onClose} />
                    ))}

                    <div className="my-4 border-t border-slate-100 mx-4" />

                    {/* Enlaces Sueltos */}
                    <p className="px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">General</p>
                    {standaloneLinks.map((item) => (
                        <DrawerLink key={item.path} item={item} onClick={onClose} />
                    ))}
                </div>

                {/* Footer del Drawer (Opcional: Versión o Logout) */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
                    v1.0.0
                </div>
            </aside>
        </>
    );
};