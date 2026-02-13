// src/components/layout/MainLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { TopBar } from './topAppBar/TopAppBar';

export const MainLayout = () => {
    // Inicializamos el estado basándonos en el tamaño actual de la ventana
    const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            // Si la pantalla baja de 1024px, comprimimos (false)
            // Si sube de 1024px, expandimos (true)
            if (window.innerWidth < 1024) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        // Ejecutamos una vez al montar para asegurar el estado correcto
        handleResize();

        // Escuchamos los cambios de tamaño
        window.addEventListener('resize', handleResize);

        // Limpieza del evento
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSidebarToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fcfdfe]">
            {/* Sidebar SIEMPRE visible (quitamos el 'hidden lg:flex') */}
            <NavSidebar
                isExpanded={isExpanded}
                onToggle={handleSidebarToggle}
                // Eliminamos la clase className="hidden lg:flex" para que se vea en móviles/tablets
            />

            {/* Ya no renderizamos el NavDrawer aquí */}

            {/* Contenedor principal */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                // Quitamos el prefijo 'lg:' porque ahora el margen aplica a todos los tamaños
                isExpanded ? "ml-[280px]" : "ml-[80px]"
            )}>
                {/* TopBar centrado y flotante */}
                <TopBar/>

                {/* Área de contenido */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};