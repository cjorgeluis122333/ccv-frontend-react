import type {Partner} from "@/features/partner/types/partnerResponseType.ts";

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
                        <th className="px-6 py-4 w-20">Acción</th>
                        <th className="px-6 py-4">Nombre Completo</th>
                        <th className="px-6 py-4">Cédula</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4">Fecha Nac.</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {data.map((partner, index) => (
                        <tr
                            key={`${partner.acc}-${partner.cedula}-${index}`}
                            className="hover:bg-slate-50/50 transition-colors group"
                        >
                            <td className="px-6 py-4 font-mono text-slate-400 font-medium">
                                #{partner.acc}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800 group-hover:text-blue-500 transition-colors">{partner.nombre}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-600">
                                {partner.cedula > 0 ? partner.cedula.toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {partner.correo && partner.correo !== '@' ? (
                                        <span className="flex items-center gap-2 text-slate-600">
                                                <span className="material-symbols-rounded text-[14px] text-slate-300">mail</span>
                                            {partner.correo}
                                            </span>
                                    ) : (
                                        <span className="text-slate-300 text-xs italic">Sin correo</span>
                                    )}
                                    {partner.telefono && partner.telefono !== 'NO' ? (
                                        <span className="flex items-center gap-2 text-slate-500 text-xs">
                                                <span className="material-symbols-rounded text-[14px] text-slate-300">call</span>
                                            {partner.telefono}
                                            </span>
                                    ) : null}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-400 font-medium">
                                {partner.nacimiento}
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};