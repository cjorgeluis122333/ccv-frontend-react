import React from 'react';

interface GenericLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

/**
 * GenericLoader - A premium, generic loading component designed for data-fetching states.
 * It features a subtle pulse animation and a clean, centered layout with backdrop effects.
 */
export const GenericLoader: React.FC<GenericLoaderProps> = ({
    message = "Cargando información...",
    fullScreen = false
}) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md"
        : "flex flex-col items-center justify-center p-20 w-full min-h-[400px]";

    return (
        <div className={containerClasses}>
            <div className="relative group">
                {/* Outer decorative ring */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse group-hover:duration-1000" />

                {/* Inner spinner/visual element */}
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 relative">
                        {/* Elegant spinning orbit */}
                        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-600 animate-spin" />

                        {/* Static center icon/dot */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 animate-pulse flex items-center justify-center">
                                <span className="material-symbols-rounded text-white text-sm">wifi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading text with premium typography */}
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
                <h3 className="text-xl font-display font-semibold text-slate-800 tracking-tight">
                    {message}
                </h3>
                <p className="mt-2 text-slate-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                    Estamos preparando el contenido para ti. Esto no debería tardar mucho.
                </p>

                {/* Progress-like decorative line */}
                <div className="mt-8 w-48 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/3 rounded-full animate-[loading-shimmer_2s_infinite_ease-in-out]" />
                </div>
            </div>

            <style>{`
                @keyframes loading-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
};
