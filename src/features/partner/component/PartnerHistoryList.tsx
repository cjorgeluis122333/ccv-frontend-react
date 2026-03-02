import type { HistoryItem } from '@/features/partner/types/partnerResponseType';

interface Props {
    history: HistoryItem[];
    isLoading: boolean;
    error: string | null;
}

export const PartnerHistoryList = ({ history, isLoading, error }: Props) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center mt-6">
                <span className="material-symbols-rounded text-indigo-500 text-4xl animate-spin mb-4">progress_activity</span>
                <p className="text-slate-500 font-medium">Cargando historial de operaciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6 mt-6 flex items-start gap-4">
                <span className="material-symbols-rounded text-red-500 text-2xl">error</span>
                <div>
                    <h4 className="text-red-800 font-bold mb-1">Error al cargar historial</h4>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed shadow-sm p-10 text-center mt-6">
                <span className="material-symbols-rounded text-slate-300 text-5xl mb-3 block">history</span>
                <h3 className="text-slate-700 font-bold text-lg mb-1">Sin historial</h3>
                <p className="text-slate-500 text-sm">Este socio no tiene operaciones registradas aún.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600">
                        <span className="material-symbols-rounded text-sm">receipt_long</span>
                    </span>
                    <h3 className="font-bold text-slate-800">Historial de Operaciones</h3>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {history.length} registros
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Descripción / Mes</th>
                            <th className="px-6 py-4">Operador</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map((item) => (
                            <tr key={item.ind} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-rounded text-slate-300 text-[18px]">calendar_today</span>
                                        <span className="text-sm font-semibold text-slate-700">{item.fecha}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-slate-800">{item.descript}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                                                {item.oper.split('|')[0] || 'Ope'}
                                            </span>
                                            <span className="text-xs text-slate-500">Ref: {item.mes}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                            <span className="material-symbols-rounded text-[14px] text-slate-500">person</span>
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium capitalize">{item.operador}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                        ${Number(item.monto).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
