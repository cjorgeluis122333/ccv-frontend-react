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
            <div className="mb-12 flex flex-col items-center">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-8">
                    Junta Directiva {selectedYear ? `${selectedYear} - ${selectedYear + 1}` : ""}
                </h1>

                <div className="w-full flex justify-center">
                    <YearSelector
                        years={availableYears}
                        selectedYear={selectedYear}
                        onSelectYear={setSelectedYear}
                    />
                </div>
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
