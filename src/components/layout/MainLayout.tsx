import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavDrawer } from './NavDrawer';

export const MainLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Navbar Superior */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
                <h1 className="text-xl font-bold text-slate-800">CCV Dashboard</h1>

                {/* Botón Hamburguesa (A la derecha) */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <span className="material-symbols-rounded text-3xl">menu</span>
                </button>
            </header>

            {/* Drawer Component */}
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Contenido Principal (Aquí se renderizan las rutas hijas) */}
            <main className="p-4 lg:p-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};