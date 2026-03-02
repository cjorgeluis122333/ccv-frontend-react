import { useBoard } from "../hooks/useBoard";
import { YearSelector } from "../component/YearSelector";
import { BoardMemberGrid } from "../component/BoardMemberGrid";

export const BoardScreen = () => {
    const {
        loading,
        error,
        selectedYear,
        setSelectedYear,
        selectedBoard,
        availableYears,
    } = useBoard();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <span className="material-symbols-rounded animate-spin text-4xl text-blue-600">progress_activity</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                <span className="material-symbols-rounded text-4xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-black text-red-800 mb-2">Error</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Responsive Header with Premium Flags */}
            <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 max-w-5xl mx-auto px-4">
                {/* Venezuela Flag - Left (Premium Styling) */}
                <div className="flex-shrink-0 group">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-4 ring-blue-50/50 transform group-hover:scale-110 transition-transform duration-500">
                        <img src="https://flagcdn.com/ve.svg" alt="Venezuela" className="w-full h-full object-cover scale-150" />
                    </div>
                </div>

                <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-none mb-4">
                        Junta Directiva
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-slate-200 hidden sm:block"></div>
                        <p className="text-lg sm:text-2xl font-black text-blue-600 bg-blue-50/80 backdrop-blur-sm px-8 py-2 rounded-2xl border border-blue-100 shadow-sm whitespace-nowrap">
                            {selectedYear ? `${selectedYear} - ${selectedYear + 1}` : "..."}
                        </p>
                        <div className="h-px w-8 bg-slate-200 hidden sm:block"></div>
                    </div>
                </div>

                {/* Cuba Flag - Right (Premium Styling) */}
                <div className="flex-shrink-0 group">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-4 ring-blue-50/50 transform group-hover:scale-110 transition-transform duration-500">
                        <img src="https://flagcdn.com/cu.svg" alt="Cuba" className="w-full h-full object-cover scale-150" />
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mb-16">
                <YearSelector
                    years={availableYears}
                    selectedYear={selectedYear}
                    onSelectYear={setSelectedYear}
                />
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                {selectedBoard ? (
                    <div className="animate-in fade-in zoom-in-95 duration-700">
                        <BoardMemberGrid board={selectedBoard} />
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        No hay información disponible para este período.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardScreen;
