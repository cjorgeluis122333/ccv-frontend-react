import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { menuSections, standaloneLinks } from '@/config/navigation';
import { DrawerGroup, DrawerLink } from './DrawerItems';

interface NavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NavDrawer = ({ isOpen, onClose }: NavDrawerProps) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/40 z-40 transition-opacity duration-300 backdrop-blur-[2px]",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer - Ahora en el lado IZQUIERDO (left-0 y -translate-x-full) */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Cabecera */}
                <div className="p-8 flex flex-col items-center border-b border-slate-50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <span className="material-symbols-rounded text-xl">close</span>
                    </button>

                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200 mb-4">
                        CCV
                    </div>
                    <h2 className="font-bold text-slate-900 text-lg">Tu Empresa S.A.</h2>
                    <p className="text-xs font-medium text-slate-400">Panel de Administración</p>
                </div>

                {/* Contenido con Scroll */}
                <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                    <div className="space-y-1">
                        {menuSections.map((section) => (
                            <DrawerGroup key={section.title} section={section} onClose={onClose} />
                        ))}
                    </div>

                    <div className="my-6 border-t border-slate-100 mx-4" />

                    <div className="space-y-1">
                        <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">General</p>
                        {standaloneLinks.map((item) => (
                            <DrawerLink key={item.path} item={item} onClick={onClose} />
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center text-[10px] font-bold text-slate-400 tracking-tight">
                    VERSIÓN 1.0.0
                </div>
            </aside>
        </>
    );
};