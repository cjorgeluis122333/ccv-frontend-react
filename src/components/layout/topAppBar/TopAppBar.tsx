// src/components/layout/TopBar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import { LogoutModal } from "@/components/ui/modal/LogoutModal.tsx";
import { useAuthUser } from '@/hooks/useAuthUser'; // Importamos nuestro hook

export const TopBar = () => {
    const navigate = useNavigate();
    const user = useAuthUser(); // <--- Aquí obtenemos los datos

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Helper para obtener iniciales (Ej: "Juan Perez" -> "JP")
    const getInitials = (name: string | undefined) => {
        if (!name) return "US";
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            navigate('/login');
        } catch  {
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-4 lg:px-8 transition-all">

                {/* ... (Parte Izquierda igual) ... */}
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-black text-slate-800 tracking-tight hidden sm:block">
                        CCV Dash
                    </h1>
                </div>

                {/* Derecha: Datos Dinámicos */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                {/* NOMBRE DINÁMICO */}
                                <p className="text-xs font-bold text-slate-700 leading-none">
                                    {user?.name || 'Usuario'}
                                </p>
                                {/* ROL (Si lo tienes en el objeto user) */}
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {user?.email || 'Socio'}
                                </p>
                            </div>

                            {/* AVATAR CON INICIALES */}
                            <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white group-hover:ring-blue-50 transition-all text-xs">
                                {getInitials(user?.name)}
                            </div>
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />

                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-sm font-bold text-slate-800">{user?.name || 'Usuario'}</p>
                                        {/* EMAIL DINÁMICO */}
                                        <p className="text-xs text-slate-400 truncate">
                                            {user?.email || 'usuario@ccv.com'}
                                        </p>
                                    </div>

                                    {/* ... Resto de botones (Configuración, Logout) igual ... */}
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
                                            setShowLogoutModal(true);
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

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />
        </>
    );
};