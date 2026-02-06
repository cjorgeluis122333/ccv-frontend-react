import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const SidebarLink = ({ item, isExpanded }: { item: any; isExpanded: boolean }) => {
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

            {/* Texto - Se oculta con transición de opacidad */}
            <span className={cn(
                "transition-all duration-300 truncate",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}>
        {item.title}
      </span>

            {/* Tooltip pequeño para cuando está contraído (Opcional pero recomendado) */}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {item.title}
                </div>
            )}
        </NavLink>
    );
};

export const SidebarGroup = ({ section, isExpanded }: { section: any; isExpanded: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Si se contrae el sidebar, cerramos automáticamente los acordeones
    if (!isExpanded && isOpen) setIsOpen(false);

    return (
        <div className="mb-1">
            <button
                onClick={() => isExpanded && setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl transition-all",
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
                        "material-symbols-rounded !text-[18px] ml-auto transition-transform",
                        isOpen && "rotate-180"
                    )}>
            expand_more
          </span>
                )}
            </button>

            {/* Sub-items: Solo se muestran si está expandido y abierto */}
            {isExpanded && (
                <div className={cn(
                    "overflow-hidden transition-all duration-300 px-2 ml-6 border-l-2 border-slate-100",
                    isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                )}>
                    {section.items.map((item: any) => (
                        <SidebarLink key={item.path} item={item} isExpanded={isExpanded} />
                    ))}
                </div>
            )}
        </div>
    );
};