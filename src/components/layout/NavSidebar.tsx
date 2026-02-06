import { cn } from '@/lib/utils';
import { menuSections, standaloneLinks } from '@/config/navigation';
import { SidebarGroup, SidebarLink } from './SidebarItems';

interface NavSidebarProps {
    isExpanded: boolean;
    onToggle: () => void;
}

export const NavSidebar = ({ isExpanded, onToggle }: NavSidebarProps) => {

    // Función auxiliar: Solo llama a toggle si está cerrado.
    const handleForceExpand = () => {
        if (!isExpanded) {
            onToggle();
        }
    };

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
                isExpanded ? "w-[280px]" : "w-[80px]"
            )}
        >
            {/* Header / Toggle */}
            <div className="h-16 flex items-center px-6 mb-4">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                    <span className="material-symbols-rounded text-2xl">menu</span>
                </button>
                <span className={cn(
                    "ml-4 font-black text-slate-900 tracking-tight transition-opacity duration-300 whitespace-nowrap",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}>
                    MENU
                </span>
            </div>

            {/* Perfil / Logo */}
            <div className={cn(
                "flex flex-col items-center mb-8 px-4 transition-all duration-300",
                isExpanded ? "opacity-100 translate-y-0" : "opacity-0 invisible translate-y-4 h-0 overflow-hidden"
            )}>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200 mb-4">
                    CCV
                </div>
                <h2 className="font-bold text-slate-900 text-center line-clamp-1">Tu Empresa S.A.</h2>
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
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-center text-[10px] font-bold text-slate-400 whitespace-nowrap overflow-hidden">
                {isExpanded ? "VERSIÓN 1.0.0" : "V1"}
            </div>
        </aside>
    );
};