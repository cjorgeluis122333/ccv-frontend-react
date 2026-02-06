import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type {NavItem, NavSection} from '@/config/navigation';
import {cn} from "@/lib/utils.ts";

// 1. Componente para un enlace simple (Single Item)
export const DrawerLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mx-2",
                    isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
            }
        >
            {/* Icono opcional */}
            {item.icon && <span className="material-symbols-rounded text-[20px]">{item.icon}</span>}
            <span>{item.title}</span>
        </NavLink>
    );
};

// 2. Componente para Grupo Desplegable (Accordion)
export const DrawerGroup = ({ section, onClose }: { section: NavSection; onClose: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Verificar si algún hijo está activo para dejar abierto el grupo (UX Pro)
    const hasActiveChild = section.items.some(item => location.pathname.startsWith(item.path));

    return (
        <div className="mx-2 mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-colors",
                    hasActiveChild ? "text-blue-700 bg-blue-50/50" : "text-slate-700 hover:bg-slate-50"
                )}
            >
                <div className="flex items-center gap-3">
                    {section.icon && <span className="material-symbols-rounded text-[22px]">{section.icon}</span>}
                    <span>{section.title}</span>
                </div>
                <span className={cn("material-symbols-rounded transition-transform duration-200", isOpen && "rotate-180")}>
          expand_more
        </span>
            </button>

            {/* Animación simple de despliegue */}
            <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="mt-1 ml-4 border-l-2 border-slate-100 pl-2 space-y-1">
                    {section.items.map((item) => (
                        <DrawerLink key={item.path} item={item} onClick={onClose} />
                    ))}
                </div>
            </div>
        </div>
    );
};