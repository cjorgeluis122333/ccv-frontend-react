import { useRef } from "react";

interface YearSelectorProps {
    years: number[];
    selectedYear: number | null;
    onSelectYear: (year: number) => void;
}

export const YearSelector = ({ years, selectedYear, onSelectYear }: YearSelectorProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 200;
        scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <div className="relative w-full bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] px-12 py-3">

            {/* Flecha izquierda */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all active:scale-90"
                aria-label="Anterior"
            >
                <span className="material-symbols-rounded text-lg leading-none">chevron_left</span>
            </button>

            {/* Gradientes de borde */}
            <div className="absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent pointer-events-none z-[1]" />
            <div className="absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none z-[1]" />

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {years.map((year) => (
                    <button
                        key={year}
                        onClick={() => onSelectYear(year)}
                        className={`px-5 py-2 rounded-xl font-black text-sm transition-all border-2 flex items-center gap-2 shrink-0 ${selectedYear === year
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105"
                                : "bg-white/80 text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                    >
                        <span className="material-symbols-rounded text-base">calendar_today</span>
                        {year} - {year + 1}
                    </button>
                ))}
            </div>

            {/* Flecha derecha */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all active:scale-90"
                aria-label="Siguiente"
            >
                <span className="material-symbols-rounded text-lg leading-none">chevron_right</span>
            </button>
        </div>
    );
};
