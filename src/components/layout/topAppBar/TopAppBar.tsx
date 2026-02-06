// src/components/layout/TopBar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import {LogoutModal} from "@/components/ui/modal/LogoutModal.tsx";

interface TopBarProps {
    onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error("Error logout", error);
            // Incluso si falla, forzamos la salida visual
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-4 lg:px-8 transition-all">

                {/* Izquierda: Título y Toggle Menu (Móvil) */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <span className="material-symbols-rounded text-2xl">menu</span>
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight hidden sm:block">
                        CCV Dash
                    </h1>
                </div>

                {/* Derecha: Acciones y Perfil */}
                <div className="flex items-center gap-4">
                    {/* Botón de Notificaciones (Ejemplo) */}
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors relative">
                        <span className="material-symbols-rounded text-[22px]">notifications</span>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>

                    {/* Dropdown de Usuario */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-700 leading-none">Admin User</p>
                                <p className="text-[10px] text-slate-400 font-medium">Administrador</p>
                            </div>
                            <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white group-hover:ring-blue-50 transition-all">
                                AD
                            </div>
                        </button>

                        {/* Menú Desplegable */}
                        {isMenuOpen && (
                            <>
                                {/* Overlay invisible para cerrar al hacer click afuera */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />

                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-sm font-bold text-slate-800">Mi Perfil</p>
                                        <p className="text-xs text-slate-400 truncate">admin@empresa.com</p>
                                    </div>

                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium flex items-center gap-3 transition-colors"
                                        onClick={() => navigate('/mi-cuenta')}
                                    >
                                        <span className="material-symbols-rounded text-[20px] text-slate-400">settings</span>
                                        Configuración
                                    </button>

                                    <div className="my-1 border-t border-slate-50"></div>

                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setShowLogoutModal(true); // <--- Abre el modal
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-rounded text-[20px]">logout</span>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal de Confirmación inyectado aquí */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />
        </>
    );
};