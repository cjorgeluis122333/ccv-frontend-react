import {INPUT_THEMES, type InputStyleConfig} from "@/utils/inputTheme.ts";

interface SelectOption {
    label: string;
    value: string | number;
}

interface GenericSelectProps<T> {
    label: string;
    field: keyof T;
    value: string | number | null | undefined;
    onChange: (field: keyof T, value: string) => void;
    icon: string;
    options: SelectOption[];
    styles?: InputStyleConfig;
    disabled?: boolean;
    placeholder?: string;
}

export const InputSelectedOption = <T,>({
                                      label,
                                      field,
                                      value,
                                      onChange,
                                      icon,
                                      options,
                                      styles = INPUT_THEMES.indigo,
                                      disabled = false,
                                      placeholder = "Seleccione..."
                                  }: GenericSelectProps<T>) => {

    const displayValue = value ?? '';

    return (
        <div className={`${styles.container} group w-full relative`}>
            {/* Label e Icono (Idéntico al GenericInput) */}
            <label className={`${styles.label} font-bold text-slate-400 transition-colors uppercase flex items-center gap-1.5 hover:cursor-text`}>
                <span className={`material-symbols-rounded ${styles.iconSize}`}>
                    {icon}
                </span>
                {label}
            </label>

            <div className="relative">
                <select
                    value={displayValue}
                    disabled={disabled}
                    onChange={(e) => onChange(field, e.target.value)}
                    className={`
                        w-full border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm 
                        focus:outline-none hover:border-slate-300 transition-all 
                        appearance-none pr-10 cursor-pointer
                        ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : styles.input}
                    `}
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

                {/* Flecha personalizada */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
                    <span className="material-symbols-rounded text-[20px]">
                        expand_more
                    </span>
                </div>
            </div>
        </div>
    );
};