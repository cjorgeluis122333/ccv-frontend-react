// Componente para inputs del Titular (Editable)
import type {Partner} from "@/features/partner/types/partnerResponseType.ts";

export const InputField = ({ label, field, value, onChange, icon, type = "text" }: {
    label: string, field: keyof Partner, value: string | number | null | undefined,
    onChange: (f: keyof Partner, v: string) => void, icon: string, type?: string
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1.5 group">
            <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-1.5 hover:cursor-text">
                <span className="material-symbols-rounded text-[1.2em]">{icon}</span>
                {label}
            </label>
            <input
                type={type}
                value={displayValue}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm h-[46px] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder={`Ingrese ${label.toLowerCase()}`}
            />
        </div>
    );
};
