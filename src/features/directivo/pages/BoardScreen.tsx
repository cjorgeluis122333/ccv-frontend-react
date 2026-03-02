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
            <div className="mb-12 flex items-center justify-between gap-6 max-w-4xl mx-auto">
                {/* Venezuela Flag - Left */}
                <div className="w-16 h-10 shadow-xl rounded-xl overflow-hidden border-2 border-white ring-1 ring-slate-100 flex-shrink-0">
                    <img src="https://flagcdn.com/ve.svg" alt="Venezuela" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col items-center text-center flex-grow">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">
                        Junta Directiva
                    </h1>
                    <p className="text-2xl font-bold text-blue-600 bg-blue-50 px-6 py-1 rounded-full border border-blue-100 italic">
                        {selectedYear ? `${selectedYear} - ${selectedYear + 1}` : "Cargando..."}
                    </p>
                </div>

                {/* Cuba Flag - Right */}
                <div className="w-16 h-10 shadow-xl rounded-xl overflow-hidden border-2 border-white ring-1 ring-slate-100 flex-shrink-0">
                    <img src="https://flagcdn.com/cu.svg" alt="Cuba" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="w-full flex justify-center mb-12">
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
