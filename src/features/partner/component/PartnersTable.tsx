import type { Partner } from "@/features/partner/types/partnerResponseType.ts";
import {calculateAge} from "@/utils/Date.ts";

interface PartnersTableProps {
    data: Partner[];
    isLoading: boolean;
}

export const PartnersTable = ({ data, isLoading }: PartnersTableProps) => {


    if (isLoading) {
        return (
            <div className="w-full p-20 flex justify-center text-slate-400">
                <span className="material-symbols-rounded animate-spin text-4xl">progress_activity</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No se encontraron registros.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                        <th className="px-4 py-4 w-12 text-center">#</th>
                        <th className="px-6 py-4 w-20">Acción</th>
                        <th className="px-6 py-4">Nombre Completo</th>
                        <th className="px-6 py-4">Cédula</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Correo</th>
                        <th className="px-6 py-4 text-center">Edad</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {data.map((partner, index) => (
                        <tr
                            key={`${partner.acc}-${partner.cedula}-${index}`}
                            className="hover:bg-slate-50/50 transition-colors group"
                        >
                            {/* Columna de Índice correlativo */}
                            <td className="px-4 py-4 text-center text-slate-400 font-medium border-r border-slate-50">
                                {index + 1}
                            </td>

                            <td className="px-6 py-4 font-mono text-slate-400 font-medium">
                                #{partner.acc}
                            </td>

                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800 group-hover:text-blue-500 transition-colors">
                                    {partner.nombre}
                                </div>
                            </td>

                            <td className="px-6 py-4 font-mono text-slate-600">
                                {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                            </td>

                            {/* Columna Teléfono Desestructurada */}
                            <td className="px-6 py-4">
                                {partner.telefono && partner.telefono !== 'NO' ? (
                                    <span className="flex items-center gap-2 text-slate-600">
                                            <span className="material-symbols-rounded text-[18px] text-slate-300">call</span>
                                        {partner.telefono}
                                        </span>
                                ) : (
                                    <span className="text-slate-300 italic text-xs">N/A</span>
                                )}
                            </td>

                            {/* Columna Correo Desestructurada */}
                            <td className="px-6 py-4">
                                {partner.correo && partner.correo !== '@' ? (
                                    <span className="flex items-center gap-2 text-slate-600">
                                            <span className="material-symbols-rounded text-[18px] text-slate-300">mail</span>
                                        {partner.correo}
                                        </span>
                                ) : (
                                    <span className="text-slate-300 italic text-xs">Sin correo</span>
                                )}
                            </td>

                            {/* Columna de Edad Calculada */}
                            <td className="px-6 py-4 text-center font-mono text-slate-600 font-bold">
                                {calculateAge(partner.nacimiento)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};