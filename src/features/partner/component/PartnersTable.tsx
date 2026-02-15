import type { Partner } from "@/features/partner/types/partnerResponseType.ts";
import { calculateAge } from "@/utils/Date.ts";
import { LoadingOverlay } from "@/components/ui/Loader/LoadingOverlay";

interface PartnersTableProps {
    data: Partner[];
    isLoading: boolean;
}

export const PartnersTable = ({ data, isLoading }: PartnersTableProps) => {
    if (isLoading && data.length === 0) {
        return (
            <div className="w-full h-[400px] relative">
                <LoadingOverlay message="Cargando directorio de socios..." />
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
        <div className="w-full relative min-h-[400px]">
            {isLoading && <LoadingOverlay transparent message="Actualizando directorio..." />}
            
            {/* Vista de Escritorio (Tabla) - Optimizada para ≥1024px */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Acción</th>
                            <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Socio</th>
                            <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Identificación</th>
                            <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Contacto</th>
                            <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100 text-right">Edad</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((partner, index) => (
                            <tr
                                key={`partner-${partner.acc}-${partner.cedula}-${index}`}
                                className="hover:bg-slate-50/80 transition-all group cursor-default"
                            >
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white text-blue-600 font-black text-xs border border-slate-200 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                                        #{partner.acc}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs border border-white shadow-sm group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
                                            {partner.nombre.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                                {partner.nombre}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-medium">Socio Activo</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-700 font-bold text-xs">Cédula</span>
                                        <span className="text-slate-500 font-mono text-[11px]">
                                            {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <span className="material-symbols-rounded text-[14px] text-slate-400 group-hover:text-blue-600">call</span>
                                            </div>
                                            <span className="text-[11px] font-medium">{partner.telefono !== 'NO' ? partner.telefono : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <span className="material-symbols-rounded text-[14px] text-slate-400 group-hover:text-blue-600">mail</span>
                                            </div>
                                            <span className="text-[11px] font-medium truncate max-w-[150px]">{partner.correo !== '@' ? partner.correo : 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="inline-flex items-center gap-2 justify-end">
                                        <span className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {calculateAge(partner.nacimiento)}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">años</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Adaptativa (Cards) - Visible en pantallas menores a lg */}
            <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
                {data.map((partner, index) => (
                    <div 
                        key={`card-${partner.acc}-${partner.cedula}-${index}`} 
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-all duration-200"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-200">
                                    {partner.nombre.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-slate-900 leading-tight truncate">{partner.nombre}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">
                                            Acción #{partner.acc}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 font-mono border border-slate-200">
                                ID: {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Contacto</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                            <span className="material-symbols-rounded text-[14px] text-blue-500">call</span>
                                        </div>
                                        <span className="truncate">{partner.telefono !== 'NO' ? partner.telefono : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                            <span className="material-symbols-rounded text-[14px] text-blue-500">mail</span>
                                        </div>
                                        <span className="truncate">{partner.correo !== '@' ? partner.correo : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 flex flex-col justify-between">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Información Personal</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-800">{calculateAge(partner.nacimiento)}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">años</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                        <span className="material-symbols-rounded text-blue-600 text-lg">cake</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
