import type { Debt } from '../types/paymentTypes';

interface DebtListProps {
    debts: Debt[];
    selectedDebts: Debt[];
    onToggleDebt: (debt: Debt) => void;
    isLoading: boolean;
}

export const DebtList = ({ debts, selectedDebts, onToggleDebt, isLoading }: DebtListProps) => {

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                <span className="material-symbols-rounded text-4xl animate-spin text-indigo-400">progress_activity</span>
                <p className="font-semibold text-sm mt-2">Cargando deudas...</p>
            </div>
        );
    }

    if (!debts || debts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                 <span className="material-symbols-rounded text-4xl text-emerald-400 mb-2">check_circle</span>
                 <p className="font-bold text-slate-600">Al día</p>
                 <p className="text-xs text-slate-500">El socio no presenta deudas pendientes.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {debts.map((debt, index) => {
                const isSelected = selectedDebts.some(d => d.mes === debt.mes);
                return (
                    <div 
                        key={`${debt.mes}-${index}`}
                        onClick={() => onToggleDebt(debt)}
                        className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group
                            ${isSelected 
                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            }
                        `}
                    >
                        {/* Indicador visual de selección en la esquina */}
                        {isSelected && (
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-start justify-end p-1.5 bg-indigo-500 rounded-bl-xl z-10">
                                <span className="material-symbols-rounded text-white text-[14px]">check</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3 relative z-20 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg shrink-0
                                ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'} transition-colors`}
                            >
                                <span className="material-symbols-rounded text-[20px]">calendar_month</span>
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden pr-1">
                                <h4 className="font-bold text-slate-800 text-sm whitespace-nowrap truncate leading-tight">
                                    {debt.mes}
                                </h4>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate opacity-80">
                                    {debt.estado}
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-right relative z-20 shrink-0 ml-4 pl-2 border-l border-slate-50">
                            <p className="text-sm font-black text-rose-500">${Number(debt.deuda_pendiente).toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 font-medium line-through">
                                Cuota: ${Number(debt.cuota_aplicada).toFixed(2)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
