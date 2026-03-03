import {useBoard} from "../hooks/useBoard";
import {YearSelector} from "../component/YearSelector";
import {BoardMemberGrid} from "../component/BoardMemberGrid";
import {BoardHeader} from "@/features/directivo/component/BoardHeader.tsx";

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
        <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100 selection:text-blue-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <BoardHeader selectedYear={selectedYear} />
            </div>
            {/*Selector de año*/}
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
                        <BoardMemberGrid board={selectedBoard}/>
                    </div>
                ) : (
                    <div
                        className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        No hay información disponible para este período.
                    </div>
                )}
            </div>
        </div>
    );
};
