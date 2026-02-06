import { forwardRef } from 'react';
import {cn} from "@/utils/utils.ts";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all",
                        "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);