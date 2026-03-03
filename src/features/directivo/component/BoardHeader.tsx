interface BoardHeaderType {
    selectedYear: number | null;
}

/**
 * Componente funcional para el encabezado con banderas.
 * Recibe el año seleccionado y muestra el período correspondiente.
 */
export const BoardHeader = ({ selectedYear }: BoardHeaderType) => {
    const periodText = selectedYear ? `${selectedYear} - ${selectedYear + 1}` : "...";

    return (
        <div className="mb-16 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto px-6 py-10 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-white to-red-500 opacity-50" />

            {/* Cuba Flag - Left */}
            <div className="flex flex-col items-center gap-3 group order-1">
                <div className="relative w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden ring-1 ring-slate-100 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 z-10" />
                    <img
                        src="https://flagcdn.com/cu.svg"
                        alt="Cuba"
                        className="w-full h-full object-cover object-left scale-110"
                    />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400  group-hover:text-blue-600  transition-colors duration-300">Cuba</span>
            </div>

            {/* Center Text Section */}
            <div className="flex flex-col items-center text-center space-y-6 order-1 lg:order-2 z-20">
                <div className="space-y-2">
                    <span className="text-blue-600 font-bold tracking-[0.4em] text-xs uppercase block">Estructura Organizativa</span>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none">
                        Junta <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Directiva</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-slate-200 hidden md:block" />
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                        <div className="relative text-2xl sm:text-3xl font-black text-blue-700 bg-white px-12 py-4 rounded-2xl border border-blue-50 shadow-inner whitespace-nowrap">
                            {periodText}
                        </div>
                    </div>
                    <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-slate-200 hidden md:block" />
                </div>
            </div>
            {/* Venezuela Flag - Right */}
            <div className="flex flex-col items-center gap-3 group order-2 lg:order-3">
                <div className="relative w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden ring-1 ring-slate-100 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 z-10" />
                    <img
                        src="https://flagcdn.com/ve.svg"
                        alt="Venezuela"
                        className="w-full h-full object-cover object-center scale-125"
                    />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400  group-hover:text-red-600 transition-colors duration-300">Venezuela</span>
            </div>


        </div>
    );
};
