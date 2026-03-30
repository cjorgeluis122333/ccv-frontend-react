import type { GuestPaginatedResponse, GuestYearData, PaginationLink } from '../types/guestTypes';

interface GuestHistoryListProps {
    paginatedGuests: GuestPaginatedResponse | null;
    isLoading: boolean;
    error: string | null;
    onPageChange: (page: number) => void;
}

const parsePageFromUrl = (url: string | null): number | null => {
    if (!url) return null;
    try {
        const parsedUrl = new URL(url);
        const pageParam = parsedUrl.searchParams.get('page');
        if (pageParam) return Number.parseInt(pageParam, 10);
    } catch {
        // Fallback for simple parsings
        const match = url.match(/page=(\d+)/);
        if (match) return Number.parseInt(match[1], 10);
    }
    return null;
};

export const GuestHistoryList = ({ paginatedGuests, isLoading, error, onPageChange }: GuestHistoryListProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                <span className="material-symbols-rounded text-indigo-400 rotate-180 animate-spin text-5xl">progress_activity</span>
                <p className="text-slate-500 font-medium text-sm">Cargando historial de invitados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-4">
                <span className="material-symbols-rounded text-rose-500">error</span>
                <div>
                    <h3 className="text-rose-800 font-bold mb-1">Error al cargar historial</h3>
                    <p className="text-rose-600 text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!paginatedGuests || paginatedGuests.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="material-symbols-rounded text-slate-300 text-6xl mb-4">history</span>
                <h3 className="text-slate-700 font-bold text-lg">Sin historial de invitados</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm">No existen registros de invitados previos para el socio seleccionado o no se encontraron datos.</p>
            </div>
        );
    }

    const formatMonth = (monthStr: string) => {
        const date = new Date();
        date.setMonth(Number.parseInt(monthStr, 10) - 1);
        return date.toLocaleString('es-ES', { month: 'long' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {paginatedGuests.data.map((yearData: GuestYearData, yIdx) => (
                <div key={yearData.anio || yIdx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                        <span className="material-symbols-rounded text-indigo-500 text-xl">calendar_month</span>
                        <h3 className="text-slate-800 font-black text-lg">Año {yearData.anio}</h3>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                        {Object.entries(yearData.meses).map(([mes, mesGuests]) => (
                            <div key={mes} className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                    Mes: {formatMonth(mes)}
                                    <span className="font-semibold text-xs ml-auto lowercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{mesGuests.length} invitado(s)</span>
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {mesGuests.map((guest, idx) => (
                                        <div key={`${guest.ind}-${idx}`} className="flex flex-col bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-slate-800 uppercase text-sm group-hover:text-indigo-600 transition-colors line-clamp-1" title={guest.nombre}>
                                                    {guest.nombre}
                                                </h5>
                                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md self-start whitespace-nowrap">
                                                    {guest.fecha}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <span className="material-symbols-rounded text-slate-400 text-[16px]">badge</span>
                                                <span className="text-sm font-semibold text-slate-600">
                                                    V-{guest.cedula}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {paginatedGuests.last_page > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-4">
                    {paginatedGuests.links.map((link: PaginationLink, idx) => {
                        const pageNum = parsePageFromUrl(link.url);

                        const isPrev = link.label.includes('Previous');
                        const isNext = link.label.includes('Next');
                        
                        let label = link.label;
                        if (isPrev) label = 'Anterior';
                        if (isNext) label = 'Siguiente';

                        return (
                            <button
                                key={idx}
                                disabled={!link.url}
                                onClick={() => pageNum && onPageChange(pageNum)}
                                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all border ${
                                    link.active
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : !link.url
                                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-50'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30'
                                } flex items-center justify-center disabled:hover:border-slate-100 disabled:hover:bg-slate-50`}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
