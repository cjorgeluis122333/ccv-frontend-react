
// Input con Select para el formulario de familiares
import type {FamilyMember} from "@/features/partner/types/partnerResponseType.ts";

export const FamilySelectField = ({ label, field, value, onChange, icon, options }: {
    label: string, field: keyof FamilyMember, value: string | number | null | undefined,
    onChange: (f: keyof FamilyMember, v: string) => void, icon: string, options: { label: string, value: string }[]
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1 group relative">
            <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-fuchsia-600 transition-colors uppercase tracking-widest flex items-center gap-1 hover:cursor-text">
                <span className="material-symbols-rounded text-[14px]">{icon}</span>
                {label}
            </label>
            <div className="relative">
                <select
                    value={displayValue}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm h-[38px] shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 hover:border-slate-300 transition-all appearance-none pr-8 cursor-pointer"
                >
                    <option value="" disabled className="text-slate-400 font-normal">Seleccione...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
                    <span className="material-symbols-rounded text-[18px]">expand_more</span>
                </div>
            </div>
        </div>
    );
};
