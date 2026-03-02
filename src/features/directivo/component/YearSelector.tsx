interface YearSelectorProps {
    years: number[];
    selectedYear: number | null;
    onSelectYear: (year: number) => void;
}

export const YearSelector = ({ years, selectedYear, onSelectYear }: YearSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => onSelectYear(year)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${selectedYear === year
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 scale-105"
                            : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                >
                    {year}
                </button>
            ))}
        </div>
    );
};
