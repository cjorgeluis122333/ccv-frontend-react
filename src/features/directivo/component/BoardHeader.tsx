interface BoardHeaderType {
    selectedYear: number | null;
}

export const BoardHeader = ({ selectedYear }: BoardHeaderType) => {
    const periodText = selectedYear ? `${selectedYear} - ${selectedYear + 1}` : "...";

    return (
        <div className="mb-8 flex items-center justify-between gap-6 px-5 py-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-white to-red-500 opacity-50" />

            {/* Cuba Flag - Left */}
            <div className="flex items-center gap-3 group shrink-0">
                <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-1 ring-slate-100 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 z-10" />
                    <img
                        src="https://flagcdn.com/cu.svg"
                        alt="Cuba"
                        className="w-full h-full object-cover object-left scale-110"
                    />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors duration-300 hidden sm:block">Cuba</span>
            </div>

            {/* Center: Título + Período apilados */}
            <div className="flex flex-col items-center gap-1.5 z-20">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight whitespace-nowrap">
                    Junta <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Directiva</span>
                </h1>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
                    <div className="relative text-base font-black text-blue-700 bg-white px-5 py-1.5 rounded-xl border border-blue-50 shadow-inner whitespace-nowrap">
                        {periodText}
                    </div>
                </div>
            </div>

            {/* Venezuela Flag - Right */}
            <div className="flex items-center gap-3 group shrink-0">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-red-600 transition-colors duration-300 hidden sm:block">Venezuela</span>
                <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden ring-1 ring-slate-100 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 z-10" />
                    <img
                        src="https://flagcdn.com/ve.svg"
                        alt="Venezuela"
                        className="w-full h-full object-cover object-center scale-125"
                    />
                </div>
            </div>
        </div>
    );
};
