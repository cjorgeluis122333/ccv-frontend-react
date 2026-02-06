import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavDrawer } from './NavDrawer';

export const MainLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fcfdfe]">
            {/* Navbar Superior */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-4 lg:px-6">
                {/* Botón Hamburguesa a la IZQUIERDA */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="p-2 mr-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
                >
                    <span className="material-symbols-rounded text-2xl">menu</span>
                </button>

                <h1 className="text-lg font-black text-slate-800 tracking-tight">CCV Dash</h1>
            </header>

            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            <main className="p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};