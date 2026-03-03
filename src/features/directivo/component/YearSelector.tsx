interface YearSelectorProps {
    years: number[];
    selectedYear: number | null;
    onSelectYear: (year: number) => void;
}

export const YearSelector = ({ years, selectedYear, onSelectYear }: YearSelectorProps) => {
    return (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => onSelectYear(year)}
                    className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all border-2 flex items-center gap-2 shrink-0 snap-start ${selectedYear === year
                        ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 scale-105 -translate-y-0.5"
                        : "bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                >
                    <span className="material-symbols-rounded text-lg">calendar_today</span>
                    {year} - {year + 1}
                </button>
            ))}
        </div>
    );
};
