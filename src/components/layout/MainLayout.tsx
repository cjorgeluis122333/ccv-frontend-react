// src/components/layout/MainLayout.tsx
import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { TopBar } from './topAppBar/TopAppBar';

export const MainLayout = () => {
    const { pathname } = useLocation();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Inicialización perezosa (Lazy initialization) correcta
    const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 1024);

    // Estado derivado para saber si es móvil (útil para el overlay)
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

    // 1. Lógica de Resize
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 1024;
            setIsMobile(mobile);

            if (mobile) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Cerrar al Navegar usando requestAnimationFrame
    useEffect(() => {
        if (isMobile && isExpanded) {
            // "Engañamos" a React difiriendo la actualización un frame
            const rafId = requestAnimationFrame(() => {
                setIsExpanded(false);
            });

            // Limpieza esencial
            return () => cancelAnimationFrame(rafId);
        }
    }, [pathname]);

    // 3. Cerrar al hacer Clic Fuera (Mantenemos esta lógica como respaldo del Overlay)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMobile &&
                isExpanded &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, isMobile]);

    const handleSidebarToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fcfdfe] relative">

            {/* --- NUEVO: OVERLAY PARA MÓVIL --- */}
            {/* Solo se muestra si es móvil y el menú está abierto */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isMobile && isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsExpanded(false)} // Cierra el menú al hacer clic en lo oscuro
                aria-hidden="true"
            />

            {/* Sidebar Container */}
            {/* Añadimos 'fixed' en móvil para que flote sobre el contenido */}
            <div
                ref={sidebarRef}
                className={cn(
                    "z-50 transition-all duration-300 h-full",
                    isMobile ? "fixed left-0 top-0 bottom-0" : "sticky top-0"
                )}
            >
                <NavSidebar
                    isExpanded={isExpanded}
                    onToggle={handleSidebarToggle}
                />
            </div>

            {/* Main Content Wrapper */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                // LÓGICA DE MÁRGENES MEJORADA:
                // En Desktop (lg): 280px si expandido, 80px si colapsado.
                // En Móvil: Siempre dejamos el hueco de 80px (si tu sidebar base se ve)
                // o 0px si el sidebar se oculta totalmente.
                // Asumiendo que en móvil colapsado se ve la barrita de iconos:
                isExpanded ? "lg:ml-[280px]" : "lg:ml-[80px]",
                "ml-[80px]" // Margen base constante para móvil (para no tapar contenido con la barra mini)
            )}>
                <TopBar/>

                <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};