import React, {useState, useEffect} from 'react';

interface AdvanceMonthsFilterProps {
    initialValue: string;
    onApply: (months: number) => void;
    isLoading?: boolean;
}

export const AdvanceMonthsFilter: React.FC<AdvanceMonthsFilterProps> = ({
                                                                            initialValue,
                                                                            onApply,
                                                                            isLoading = false
                                                                        }) => {
    // Estado local para evitar renders en el padre y peticiones prematuras
    const [localValue, setLocalValue] = useState<number | string>(initialValue);

    // Mantenemos sincronizado el estado local si el padre se reinicia o cambia desde fuera
    useEffect(() => {
        setLocalValue(initialValue);
    }, [initialValue]);

    const handleApply = () => {
        const parsed = typeof localValue === 'string' ? parseInt(localValue, 10) : localValue;
        if (!isNaN(parsed) && parsed >= 0) {
            onApply(parsed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
        }
    };

    return (
        <div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
            <div className="space-y-2">
                <label
                    className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-rounded text-[1.4em]">event_upcoming</span>
                    Meses por adelanto
                </label>
                <div className="flex gap-3">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="0"
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-all shadow-sm hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={isLoading}
                        className="h-11 px-5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <span className="material-symbols-rounded animate-spin text-[1.2em]">sync</span>
                        ) : (
                            <span className="material-symbols-rounded text-[1.2em]">filter_alt</span>
                        )}
                        Filtrar
                    </button>
                </div>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                <span className="material-symbols-rounded text-[1.2em] text-indigo-400">info</span>
                <span>
                    Este valor define el parámetro <strong>adelanto</strong> para calcular las proyecciones de deudas futuras.
                </span>
            </p>
        </div>
    );
};