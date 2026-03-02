import { cn } from '@/lib/utils';
import { menuSections, standaloneLinks } from '@/config/navigation';
import { SidebarGroup, SidebarLink } from './SidebarItems';

interface NavSidebarProps {
    isExpanded: boolean;
    onToggle: () => void;
    className?: string;
}

export const NavSidebar = ({ isExpanded, onToggle, className }: NavSidebarProps) => {

    // Función auxiliar: Solo llama a toggle si está cerrado.
    const handleForceExpand = () => {
        if (!isExpanded) {
            onToggle();
        }
    };

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-50 h-full bg-white/60 backdrop-blur-2xl border-r border-white/30 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
                isExpanded ? "w-[280px]" : "w-[80px]",
                className
            )}
        >
            {/* Header / Toggle */}
            <div className="h-16 flex items-center px-6 mb-4">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-xl text-slate-500 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                >
                    <span className="material-symbols-rounded text-2xl">menu</span>
                </button>
                <span className={cn(
                    "ml-4 font-display font-black text-slate-800 tracking-wider transition-opacity duration-300 whitespace-nowrap",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}>
                    MENU
                </span>
            </div>



            {/* Navegación */}
            <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar overflow-x-hidden">
                {menuSections.map((section) => (
                    <SidebarGroup
                        key={section.title}
                        section={section}
                        isExpanded={isExpanded}
                        onExpand={handleForceExpand} // <--- Pasamos la función aquí
                    />
                ))}

                <div className="my-6 border-t border-slate-100 mx-4" />

                {standaloneLinks.map((item) => (
                    <SidebarLink key={item.path} item={item} isExpanded={isExpanded} />
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-transparent border-t border-slate-200/50 flex justify-center text-[10px] font-bold text-slate-400 whitespace-nowrap overflow-hidden tracking-widest font-display">
                {isExpanded ? "VERSIÓN 1.0.0" : "V1"}
            </div>
        </aside>
    );
};