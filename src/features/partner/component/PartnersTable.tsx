import type { Partner } from "@/features/partner/types/partnerResponseType.ts";
import { calculateAge } from "@/utils/Date.ts";

interface PartnersTableProps {
    data: Partner[];
    isLoading: boolean;
}

export const PartnersTable = ({ data, isLoading }: PartnersTableProps) => {
    if (isLoading) {
        return (
            <div className="w-full p-24 flex flex-col items-center justify-center gap-4 text-slate-400">
                <span className="material-symbols-rounded animate-spin text-5xl text-blue-500">progress_activity</span>
                <p className="text-sm font-medium animate-pulse">Cargando socios...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="p-16 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full text-slate-300">
                    <span className="material-symbols-rounded text-4xl">folder_open</span>
                </div>
                <p className="text-slate-500 font-medium">No se encontraron registros en este momento.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Vista de Escritorio (Tabla) - Visible en lg y superiores para asegurar espacio */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] w-24">Acción</th>
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Nombre Completo</th>
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Cédula</th>
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-center">Edad</th>
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Teléfono</th>
                            <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Correo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((partner, index) => (
                            <tr
                                key={`partner-${partner.acc}-${partner.cedula}-${index}`}
                                className="hover:bg-blue-50/30 transition-all group"
                            >
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-100">
                                        {partner.acc}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                        {partner.nombre}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-slate-600 font-mono text-xs">
                                        {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-700 font-bold text-xs border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-all">
                                        {calculateAge(partner.nacimiento)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {partner.telefono && partner.telefono !== 'NO' ? (
                                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                                            <span className="material-symbols-rounded text-[16px] text-slate-400">call</span>
                                            {partner.telefono}
                                        </div>
                                    ) : (
                                        <span className="text-slate-300 italic text-[10px]">N/A</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    {partner.correo && partner.correo !== '@' ? (
                                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                                            <span className="material-symbols-rounded text-[16px] text-slate-400">mail</span>
                                            {partner.correo}
                                        </div>
                                    ) : (
                                        <span className="text-slate-300 italic text-[10px]">Sin correo</span>
                                    )}
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Adaptativa (Cards) - Visible en pantallas menores a lg (incluyendo el rango 778px-950px) */}
            <div className="lg:hidden divide-y divide-slate-100">
                {data.map((partner, index) => (
                    <div key={`card-${partner.acc}-${partner.cedula}-${index}`} className="p-5 space-y-4 active:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-100">
                                    {partner.nombre.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{partner.nombre}</h3>
                                    <p className="text-xs font-mono text-slate-400 mt-0.5">Acción: #{partner.acc}</p>
                                </div>
                            </div>
                            <div className="bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 font-mono">
                                Cédula: {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Contacto</p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium truncate">
                                        <span className="material-symbols-rounded text-sm text-blue-500">call</span>
                                        {partner.telefono !== 'NO' ? partner.telefono : 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium truncate">
                                        <span className="material-symbols-rounded text-sm text-blue-500">mail</span>
                                        {partner.correo !== '@' ? partner.correo : 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Edad</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-800">{calculateAge(partner.nacimiento)}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">años</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
