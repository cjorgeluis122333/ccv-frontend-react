import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { INPUT_THEMES, type InputStyleConfig } from "@/utils/inputTheme.ts";

interface SelectOption {
    label: string;
    value: string | number;
}

interface GenericSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon: string;
    options: SelectOption[];
    styles?: InputStyleConfig;
    error?: string;
    placeholder?: string;
}

export const InputSelectedOption = forwardRef<HTMLSelectElement, GenericSelectProps>(
    ({
        label,
        icon,
        options,
        styles = INPUT_THEMES.indigo,
        error,
        className = '',
        disabled = false,
        placeholder = "Seleccione...",
        ...props
    }, ref) => {

        return (
            <div className={`${styles.container} group w-full relative ${className}`}>
                <label className={`${styles.label} font-bold text-slate-400 transition-colors uppercase flex items-center gap-1.5 hover:cursor-text`}>
                    <span className={`material-symbols-rounded ${styles.iconSize}`}>
                        {icon}
                    </span>
                    {label}
                </label>

                <div className="relative">
                    <select
                        ref={ref}
                        disabled={disabled}
                        className={`
                            w-full border text-slate-800 font-semibold text-sm shadow-sm 
                            focus:outline-none hover:border-slate-300 transition-all 
                            appearance-none pr-10 cursor-pointer
                            ${error ? 'border-red-400 focus:border-red-500 hover:border-red-500 bg-red-50/30' : 'border-slate-200'}
                            ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : styles.input}
                        `}
                        {...props}
                    >
                        <option value="" disabled className="text-slate-400 font-normal">
                            {placeholder}
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
                        <span className="material-symbols-rounded text-[20px]">
                            expand_more
                        </span>
                    </div>
                </div>
                {error && (
                    <span className="text-xs font-bold text-red-500 mt-2 block animate-in fade-in slide-in-from-top-1">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

InputSelectedOption.displayName = 'InputSelectedOption';