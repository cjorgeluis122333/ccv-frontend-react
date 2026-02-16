import React, { forwardRef, useState } from 'react';
import { cn } from "@/lib/utils.ts";
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        // Determinamos si es un campo de password para habilitar el toggle
        const isPassword = type === 'password';

        // Si es password y el estado es 'show', cambiamos el tipo a 'text'
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev);
        };

        return (
            <div className="w-full space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>

                <div className="relative group">
                    <input
                        type={inputType}
                        ref={ref}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all",
                            "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            // Añadir padding derecho si es password para que el texto no se pise con el icono
                            isPassword && "pr-12",
                            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button" // Importante: evita que el botón haga submit al formulario
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                            tabIndex={-1} // El usuario no necesita hacer focus en el ojo para navegar el form
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" strokeWidth={2} />
                            ) : (
                                <Eye className="w-5 h-5" strokeWidth={2} />
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);