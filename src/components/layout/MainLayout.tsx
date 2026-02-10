// src/components/layout/MainLayout.tsx
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {cn} from "@/lib/utils.ts";
import {NavSidebar} from "@/components/layout/NavSidebar.tsx";
import {TopBar} from './topAppBar/TopAppBar';

export const MainLayout = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="min-h-screen w-full flex bg-[#fcfdfe]">
            {/* Sidebar fijo a la izquierda */}
            <NavSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)}/>

            {/* Contenedor principal que se desplaza según el sidebar */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                isExpanded ? "lg:ml-[280px]" : "lg:ml-[80px]"
            )}>
                {/* TopBar independiente del contenido, siempre arriba */}
                <div className="w-full">
                    <TopBar />
                </div>

                {/* Área de contenido con padding consistente */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
