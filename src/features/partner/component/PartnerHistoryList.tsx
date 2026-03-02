import type { HistoryItem } from '@/features/partner/types/partnerResponseType';
import type { PaginatedResponse } from '@/types/paginationResponseTypes';

interface Props {
    historyData: PaginatedResponse<HistoryItem> | null;
    isLoading: boolean;
    error: string | null;
    onPageChange: (page: number) => void;
}

export const PartnerHistoryList = ({ historyData, isLoading, error, onPageChange }: Props) => {
    if (isLoading && !historyData) {
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

    if (!historyData || historyData.data.length === 0) {
        return (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed shadow-sm p-10 text-center mt-6">
                <span className="material-symbols-rounded text-slate-300 text-5xl mb-3 block">history</span>
                <h3 className="text-slate-700 font-bold text-lg mb-1">Sin historial</h3>
                <p className="text-slate-500 text-sm">Este socio no tiene operaciones registradas aún.</p>
            </div>
        );
    }

    const { data: history, current_page, last_page, total } = historyData;

    // Generar arreglo de páginas para botones
    const pages = Array.from({ length: last_page }, (_, i) => i + 1);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600">
                        <span className="material-symbols-rounded text-sm">receipt_long</span>
                    </span>
                    <h3 className="font-bold text-slate-800">Historial de Operaciones</h3>
                </div>
                <div className="flex items-center gap-3">
                    {isLoading && (
                        <span className="material-symbols-rounded text-indigo-500 text-sm animate-spin">progress_activity</span>
                    )}
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        {total} registros en total
                    </span>
                </div>
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
                    <tbody className="divide-y divide-slate-100 relative">
                        {isLoading && (
                            <tr className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10"></tr>
                        )}
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

            {/* Controles de Paginación */}
            {last_page > 1 && (
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <p className="text-xs font-semibold text-slate-500">
                        Mostrando página <span className="text-slate-700">{current_page}</span> de <span className="text-slate-700">{last_page}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(current_page - 1)}
                            disabled={current_page === 1 || isLoading}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                        >
                            <span className="material-symbols-rounded text-[18px]">chevron_left</span>
                        </button>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none px-1 py-0.5 hidden sm:flex">
                            {pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    disabled={isLoading}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-wait
                                        ${current_page === page
                                            ? 'bg-indigo-600 text-white border-transparent'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => onPageChange(current_page + 1)}
                            disabled={current_page === last_page || isLoading}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                        >
                            <span className="material-symbols-rounded text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
