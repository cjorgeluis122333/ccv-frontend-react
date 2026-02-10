import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- Importamos Link
import { authService } from '@/features/auth/services/authService';
import { LogoutModal } from "@/components/ui/modal/LogoutModal.tsx";
import { useAuthUser } from '@/hooks/useAuthUser';

export const TopBar = () => {
    const navigate = useNavigate();
    const user = useAuthUser();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const getInitials = (name: string | undefined) => {
        if (!name || !name.trim()) return "US";
        return name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            navigate('/login');
        } catch {
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
            {/* Contenedor de la barra superior - Ocupa todo el ancho disponible */}
            <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 flex items-center transition-all">

                <header className="w-full flex items-center justify-between px-6">

                    {/* --- IZQUIERDA: LOGO + EMPRESA --- */}
                    <div className="flex items-center">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 group focus:outline-none"
                        >
                            <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                                <img
                                    src="logo/logo_CCVe.webp"
                                    alt="Logo CCV"
                                    className="h-10 w-auto object-contain drop-shadow-sm"
                                />
                            </div>

                            <div className="hidden sm:flex flex-col">
                                <span className="text-lg font-black text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                                    CCV
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
                                    Dashboard
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* --- DERECHA: PERFIL USUARIO --- */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-transparent hover:bg-slate-50 transition-all group"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-700 leading-none">
                                        {user?.name || 'Usuario'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {user?.email || 'Socio'}
                                    </p>
                                </div>

                                <div className="w-9 h-9 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white group-hover:ring-slate-100 transition-all text-xs">
                                    {getInitials(user?.name)}
                                </div>
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-5 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-sm font-bold text-slate-800">{user?.name || 'Usuario'}</p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {user?.email || 'usuario@ccv.com'}
                                            </p>
                                        </div>

                                        <button
                                            className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium flex items-center gap-3 transition-colors"
                                            onClick={() => navigate('/mi-cuenta')}
                                        >
                                            <span className="material-symbols-rounded text-[18px] text-slate-400">settings</span>
                                            Configuración
                                        </button>

                                        <div className="my-1 border-t border-slate-50"></div>

                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-3 transition-colors"
                                        >
                                            <span className="material-symbols-rounded text-[18px]">logout</span>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />
        </>
    );
};
