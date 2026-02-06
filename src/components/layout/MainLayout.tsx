import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavSidebar } from './NavSidebar';
import {cn} from "@/lib/utils.ts";

export const MainLayout = () => {
    // Estado para controlar si el menú está expandido (true) o en modo mini (false)
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex">
            {/* Sidebar Fijo Lateral */}
            <NavSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />

            {/* Contenedor del Contenido */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isExpanded ? "ml-[280px]" : "ml-[80px]" // Ajusta el margen según el ancho del sidebar
            )}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-6">
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">CCV Dash</h1>
                </header>

                <main className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};