import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { NavItem, NavSection } from '@/config/navigation'; // Asumiendo tus tipos

// --- SidebarLink (Items individuales) ---
// No requiere cambios lógicos, ya cumple con "navegar pero no expandir"
export const SidebarLink = ({ item, isExpanded }: { item: NavItem; isExpanded: boolean }) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-4 px-4 py-3 text-sm font-semibold transition-all rounded-xl relative group",
                    isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
            }
        >
            <span className="material-symbols-rounded !text-[24px] shrink-0">
                {item.icon}
            </span>

            <span className={cn(
                "transition-all duration-300 truncate",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}>
                {item.title}
            </span>

            {/* Tooltip para modo mini */}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-lg">
                    {item.title}
                </div>
            )}
        </NavLink>
    );
};

// --- SidebarGroup (Grupos con acordeón) ---
interface SidebarGroupProps {
    section: NavSection;
    isExpanded: boolean;
    onExpand: () => void; // <--- Nueva prop para forzar la apertura del sidebar
}

export const SidebarGroup = ({ section, isExpanded, onExpand }: SidebarGroupProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Lógica inteligente: Si el sidebar se colapsa externamente, cerramos el grupo.
    // Pero si estamos en una ruta hija, mantenemos el grupo abierto al expandir.
    useEffect(() => {
        if (!isExpanded) {
            setIsOpen(false);
        } else {
            // Opcional: Si quieres que al expandir manualmente el sidebar
            // se abra el grupo donde está el usuario actualmente:
            const hasActiveChild = section.items.some(item => location.pathname.startsWith(item.path));
            if (hasActiveChild) setIsOpen(true);
        }
    }, [isExpanded, section.items, location.pathname]);

    const handleGroupClick = () => {
        if (!isExpanded) {
            // CASO 1: Sidebar cerrado -> Expandir Sidebar y Abrir Grupo
            onExpand();
            // Usamos un pequeño timeout para asegurar que la animación del sidebar
            // inicie antes de desplegar los items, se ve más fluido.
            setTimeout(() => setIsOpen(true), 150);
        } else {
            // CASO 2: Sidebar abierto -> Toggle normal del acordeón
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="mb-1">
            <button
                onClick={handleGroupClick}
                className={cn(
                    "flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl transition-all group relative",
                    isOpen ? "text-blue-600 bg-blue-50/50" : "text-slate-700 hover:bg-slate-50",
                    !isExpanded && "justify-center"
                )}
            >
                <div className="flex items-center gap-4">
                    <span className="material-symbols-rounded !text-[24px] shrink-0">
                        {section.icon}
                    </span>
                    <span className={cn(
                        "transition-all duration-300 truncate",
                        isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                    )}>
                        {section.title}
                    </span>
                </div>

                {isExpanded && (
                    <span className={cn(
                        "material-symbols-rounded !text-[18px] ml-auto transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}>
                        expand_more
                    </span>
                )}

                {/* Tooltip opcional para el grupo cuando está cerrado */}
                {!isExpanded && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-lg">
                        {section.title}
                    </div>
                )}
            </button>

            {/* Sub-items */}
            <div className={cn(
                "grid transition-all duration-300 ease-in-out px-2 border-l-2 border-slate-100 ml-6",
                isExpanded && isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    {section.items.map((item) => (
                        <SidebarLink key={item.path} item={item} isExpanded={isExpanded} />
                    ))}
                </div>
            </div>
        </div>
    );
};