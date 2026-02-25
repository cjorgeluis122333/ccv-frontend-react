import type {HTMLInputTypeAttribute} from 'react';
import {INPUT_THEMES, type InputStyleConfig} from "@/utils/inputTheme.ts";


interface GenericInputProps<T> {
    label: string;
    field: keyof T;
    value: string | number | null | undefined;
    onChange: (field: keyof T, value: string) => void;
    icon: string;
    type?: HTMLInputTypeAttribute;
    styles?: InputStyleConfig;
    placeholder?: string;
    disabled?: boolean;
}

export const GenericInput = <T, >({
                                      label,
                                      field,
                                      value,
                                      onChange,
                                      icon,
                                      type = "text",
                                      styles = INPUT_THEMES.indigo, // Por defecto el estilo del Titular
                                      placeholder,
                                      disabled = false
                                  }: GenericInputProps<T>) => {

    const displayValue = value ?? '';


    return (
        <div className={`${styles.container} group w-full`}>
            <label className={`${styles.label} font-bold text-slate-400 transition-colors uppercase flex items-center gap-1.5 hover:cursor-text`}>
                <span className={`material-symbols-rounded ${styles.iconSize}`}>
                    {icon}
                </span>
                {label}
            </label>

            <input
                type={type}
                value={displayValue}
                disabled={disabled}
                onChange={(e) => onChange(field, e.target.value)}
                // El placeholder también se vuelve más genérico
                placeholder={placeholder || `Ingrese ${label.toLowerCase()}...`}
                className={`
                    w-full border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm 
                    focus:outline-none hover:border-slate-300 transition-all 
                    placeholder:text-slate-400 placeholder:font-normal
                    ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : styles.input}
                `}
            />
        </div>
    );
};