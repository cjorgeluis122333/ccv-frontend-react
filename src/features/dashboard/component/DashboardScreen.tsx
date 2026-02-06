// src/pages/dashboard/Dashboard.tsx
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type {NavItem} from "@/types/navigationTypes.ts";
import {menuSections, standaloneLinks} from "@/config/navigation.ts";

// Componente Pequeño para la Tarjeta (Card)
const DashboardCard = ({ item }: { item: NavItem }) => {
    return (
        <Link
            to={item.path}
            className="group flex flex-col p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    item.color || "text-slate-600 bg-slate-50"
                )}>
                    <span className="material-symbols-rounded text-[28px]">
                        {item.icon}
                    </span>
                </div>

                {/* Flecha indicadora sutil */}
                <span className="material-symbols-rounded text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    arrow_forward
                </span>
            </div>

            <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {item.title}
            </h3>

            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                {item.description || "Acceder a la sección"}
            </p>
        </Link>
    );
};

export const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header de Bienvenida */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Panel General
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Bienvenido de nuevo. Aquí tienes un resumen de tus aplicaciones.
                    </p>
                </div>
                {/* Podríamos poner un widget de fecha aquí */}
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</p>
                    <p className="text-sm font-semibold text-slate-700">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Renderizado Dinámico de Secciones */}
            <div className="space-y-10">
                {menuSections.map((section) => (
                    <section key={section.title}>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            {section.icon && (
                                <span className="material-symbols-rounded text-slate-400 text-xl">
                                    {section.icon}
                                </span>
                            )}
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                {section.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {section.items.map((item) => (
                                <DashboardCard key={item.path} item={item} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* Renderizado de Links Sueltos (General) */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <span className="material-symbols-rounded text-slate-400 text-xl">apps</span>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            General
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {standaloneLinks.map((item) => (
                            <DashboardCard key={item.path} item={item} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};