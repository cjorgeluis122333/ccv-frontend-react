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
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                        <span className="material-symbols-rounded text-3xl block">groups</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">Junta Directiva</h1>
                        <p className="text-slate-500 font-medium">Histórico de directivos por período anual</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                <h2 className="text-base font-black text-slate-400 mb-4 tracking-widest uppercase">Seleccionar Año</h2>
                <YearSelector
                    years={availableYears}
                    selectedYear={selectedYear}
                    onSelectYear={setSelectedYear}
                />

                {selectedBoard ? (
                    <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 mb-6 ml-1">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            <h2 className="text-xl font-bold text-slate-800">Directivos de {selectedYear}</h2>
                        </div>
                        <BoardMemberGrid board={selectedBoard} />
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                        No hay información disponible para este año.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardScreen;
