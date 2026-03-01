import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils.ts"; // Utilidad para clases de Tailwind
import { INPUT_THEMES, type InputStyleConfig } from "@/utils/inputTheme.ts";

// Definimos las props extendiendo las nativas de un input
interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: string | LucideIcon; // Soporta Material Icons (string) o Lucide (Componente)
    styles?: InputStyleConfig;
    // Opcional: Si quieres mantener el tipado genérico para el nombre del campo
    field?: string;
}

export const SmartInput = forwardRef<HTMLInputElement, SmartInputProps>(
    ({
         label,
         error,
         icon: Icon,
         styles = INPUT_THEMES.indigo,
         type = "text",
         className,
         disabled,
         placeholder,
         ...props
     }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

        return (
            <div className={cn("w-full flex flex-col gap-1.5", styles.container)}>
                {/* Label con Icono (Estilo del Input 1) */}
                <label className={cn(
                    "font-bold text-slate-400 transition-colors uppercase flex items-center gap-1.5 text-xs ml-1",
                    styles.label,
                    error && "text-red-500" // El label también reacciona al error
                )}>
                    {Icon && typeof Icon === 'string' ? (
                        <span className={`material-symbols-rounded ${styles.iconSize || 'text-lg'}`}>
                            {Icon}
                        </span>
                    ) : Icon ? (
                        <Icon size={16} />
                    ) : null}
                    {label}
                </label>

                <div className="relative group">
                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        placeholder={placeholder || `Ingrese ${label.toLowerCase()}...`}
                        className={cn(
                            // Clases base (Input 2)
                            "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all",
                            "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            // Inyectamos estilos del tema (Input 1)
                            styles.input,
                            // Ajuste si es password o tiene error
                            isPassword && "pr-12",
                            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />

                    {/* Lógica de Password Toggle */}
                    {isPassword && !disabled && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>

                {/* Manejo de Errores */}
                {error && (
                    <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

SmartInput.displayName = "SmartInput";