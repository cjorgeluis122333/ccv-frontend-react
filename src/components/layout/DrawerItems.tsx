import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type {NavItem, NavSection} from "@/types/navigationTypes.ts";

export const DrawerLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all rounded-xl",
                    isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
            }
        >
            {item.icon && (
                <span className="material-symbols-rounded !text-[20px] shrink-0">
          {item.icon}
        </span>
            )}
            <span className="truncate">{item.title}</span>
        </NavLink>
    );
};

export const DrawerGroup = ({ section, onClose }: { section: NavSection; onClose: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const hasActiveChild = section.items.some(item => location.pathname.startsWith(item.path));

    return (
        <div className="mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all",
                    hasActiveChild ? "text-blue-600 bg-blue-50/50" : "text-slate-700 hover:bg-slate-50"
                )}
            >
                <div className="flex items-center gap-3">
                    {section.icon && (
                        <span className="material-symbols-rounded !text-[22px] shrink-0">
              {section.icon}
            </span>
                    )}
                    <span>{section.title}</span>
                </div>
                <span className={cn(
                    "material-symbols-rounded !text-[18px] transition-transform duration-300",
                    isOpen && "rotate-180"
                )}>
          expand_more
        </span>
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out px-2",
                isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
            )}>
                <div className="space-y-1 py-1 border-l-2 border-slate-100 ml-6">
                    {section.items.map((item) => (
                        <DrawerLink key={item.path} item={item} onClick={onClose} />
                    ))}
                </div>
            </div>
        </div>
    );
};