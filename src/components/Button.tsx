import {cn} from "@/utils/utils.ts";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export const Button = ({ children, isLoading, className, ...props }: ButtonProps) => {
    return (
        <button
            className={cn(
                "relative flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all",
                "hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-blue-600",
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
                children
            )}
        </button>
    );
};