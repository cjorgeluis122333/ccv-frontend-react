
interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onNext: () => void;
    onPrev: () => void;
    total: number;
    from: number;
    to: number;
    isLoading?: boolean;
}

export const Pagination = ({
                               currentPage,
                               lastPage,
                               onNext,
                               onPrev,
                               total,
                               from,
                               to,
                               isLoading
                           }: PaginationProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-slate-100 gap-4">
            {/* Info Texto */}
            <div className="text-center sm:text-left">
                <p className="text-sm text-slate-500">
                    Mostrando <span className="font-bold text-slate-700">{from}</span> a <span className="font-bold text-slate-700">{to}</span> de <span className="font-bold text-slate-700">{total}</span> resultados
                </p>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={currentPage === 1 || isLoading}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Anterior
                </button>
                <div className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-100">
                    {currentPage}
                </div>
                <button
                    onClick={onNext}
                    disabled={currentPage === lastPage || isLoading}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};