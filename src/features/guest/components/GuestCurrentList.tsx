import type { Guest } from '../types/guestTypes';

interface GuestCurrentListProps {
    guests: Guest[];
    isLoading: boolean;
    error: string | null;
}

export const GuestCurrentList = ({ guests, isLoading, error }: GuestCurrentListProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                <span className="material-symbols-rounded text-indigo-400 rotate-180 animate-spin text-4xl">progress_activity</span>
                <p className="text-slate-500 font-medium text-sm">Cargando invitados del mes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-4">
                <span className="material-symbols-rounded text-rose-500">error</span>
                <div>
                    <h3 className="text-rose-800 font-bold mb-1">Error al cargar</h3>
                    <p className="text-rose-600 text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!guests || guests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="material-symbols-rounded text-slate-300 text-5xl mb-3">group_off</span>
                <h3 className="text-slate-700 font-bold">Sin invitados este mes</h3>
                <p className="text-slate-500 text-sm mt-1">El socio no ha registrado invitados para el mes en curso.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-100 flex flex-col">
             <table className="w-full text-left border-collapse text-sm">
                 <thead className="bg-slate-50 border-b border-slate-100">
                     <tr>
                         <th className="px-5 py-3.5 font-bold text-slate-600 tracking-wide text-xs uppercase" style={{ width: '40%' }}>Invitado</th>
                         <th className="px-5 py-3.5 font-bold text-slate-600 tracking-wide text-xs uppercase" style={{ width: '30%' }}>Cédula</th>
                         <th className="px-5 py-3.5 font-bold text-slate-600 tracking-wide text-xs uppercase text-right" style={{ width: '30%' }}>Fecha Visita</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 bg-white">
                    {guests.map((guest, idx) => (
                        <tr key={`${guest.ind}-${idx}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5">
                                <span className="font-bold text-slate-700 capitalize">{guest.nombre.toLowerCase()}</span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-semibold">
                                {guest.cedula}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-semibold text-right">
                                {guest.fecha}
                            </td>
                        </tr>
                    ))}
                 </tbody>
             </table>
        </div>
    );
};
