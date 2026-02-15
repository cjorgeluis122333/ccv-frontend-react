import React from 'react';

interface LoadingOverlayProps {
    message?: string;
    transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    message = "Cargando datos...", 
    transparent = false 
}) => {
    return (
        <div className={`
            absolute inset-0 z-50 flex flex-col items-center justify-center gap-4
            ${transparent ? 'bg-white/60 backdrop-blur-[2px]' : 'bg-white'}
            transition-all duration-300 animate-in fade-in
        `}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                
                {/* Inner Pulse */}
                <div className="absolute w-8 h-8 bg-blue-600/10 rounded-full animate-ping"></div>
                
                {/* Center Icon */}
                <div className="absolute flex items-center justify-center">
                    <span className="material-symbols-rounded text-blue-600 text-xl animate-pulse">
                        sync
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-bold text-slate-800 tracking-tight">
                    {message}
                </p>
                <div className="flex gap-1">
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
    );
};
