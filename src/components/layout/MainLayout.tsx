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
            <NavSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)}/>

            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                isExpanded ? "ml-[280px]" : "ml-[80px]"
            )}>
                <TopBar />
                <main className="p-4 lg:p-8">
                    {/* Aquí el max-w-7xl sí está bien porque centra el contenido de la tabla,
                        pero la TopBar arriba seguirá siendo de ancho completo */}
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};