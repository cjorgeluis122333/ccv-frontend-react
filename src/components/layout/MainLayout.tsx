// src/components/layout/MainLayout.tsx
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {cn} from "@/lib/utils.ts";
import {NavSidebar} from "@/components/layout/NavSidebar.tsx";
import {NavDrawer} from "@/components/layout/NavDrawer.tsx";
import {TopBar} from './topAppBar/TopAppBar';

export const MainLayout = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fcfdfe]">
            {/* Sidebar solo visible en pantallas lg (≥1024px) */}
            <NavSidebar 
                isExpanded={isExpanded} 
                onToggle={handleSidebarToggle}
                className="hidden lg:flex"
            />

            {/* Drawer para pantallas pequeñas (<1024px) */}
            <NavDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />

            {/* Contenedor principal */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-[margin] duration-300",
                isExpanded ? "lg:ml-[280px]" : "lg:ml-[80px]"
            )}>
                {/* TopBar centrado y flotante */}
                <TopBar/>

                {/* Área de contenido con padding y centrado */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
