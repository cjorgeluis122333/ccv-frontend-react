// src/components/layout/MainLayout.tsx
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {cn} from "@/lib/utils.ts";
import {NavSidebar} from "@/components/layout/NavSidebar.tsx";
import {TopBar} from './topAppBar/TopAppBar';

export const MainLayout = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex">
            {/* Sidebar */}
            <NavSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)}/>

            {/* Contenido Principal */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isExpanded ? "ml-[280px]" : "ml-[80px]"
            )}>

                {/* Nuevo TopBar (Pasamos la función de toggle para móvil si fuera necesario) */}
                <TopBar/>

                <main className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};