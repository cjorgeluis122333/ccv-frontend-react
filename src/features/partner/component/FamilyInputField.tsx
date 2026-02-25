
// Input reducido para el formulario de familiares
import type {FamilyMember} from "@/features/partner/types/partnerResponseType.ts";

export const FamilyInputField = ({ label, field, value, onChange, icon, type = "text" }: {
    label: string, field: keyof FamilyMember, value: string | number | null | undefined,
    onChange: (f: keyof FamilyMember, v: string) => void, icon: string, type?: string
}) => {
    const displayValue = value === null || value === undefined ? '' : value.toString();
    return (
        <div className="space-y-1 group">
            <label className="text-[10px] font-bold text-slate-400 group-focus-within:text-fuchsia-600 transition-colors uppercase tracking-widest flex items-center gap-1 hover:cursor-text">
                <span className="material-symbols-rounded text-[14px]">{icon}</span>
                {label}
            </label>
            <input
                type={type}
                value={displayValue}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm h-[38px] shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 hover:border-slate-300 transition-all placeholder:text-slate-300 placeholder:font-normal"
                placeholder={label}
            />
        </div>
    );
};
