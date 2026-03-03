import { useEffect, useRef } from "react";
import { useBoard } from "../hooks/useBoard";
import { YearSelector } from "../component/YearSelector";
import { BoardMemberGrid } from "../component/BoardMemberGrid";
import { BoardHeader } from "@/features/directivo/component/BoardHeader.tsx";
import { GenericLoader } from "@/components/loading/GenericLoader";

export const BoardScreen = () => {
    const {
        loading,
        error,
        selectedYear,
        setSelectedYear,
        selectedBoard,
        availableYears,
    } = useBoard();

    const gridRef = useRef<HTMLDivElement>(null);
    const hasSelectedOnce = useRef(false);

    useEffect(() => {
        if (selectedYear && !loading) {
            if (hasSelectedOnce.current) {
                // Pequeño delay para asegurar que el DOM se ha actualizado con la nueva rejilla
                setTimeout(() => {
                    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            } else {
                hasSelectedOnce.current = true;
            }
        }
    }, [selectedYear, loading]);


    if (loading) {
        return <GenericLoader message="Cargando Directiva..." />;
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
        <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900 relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />
            <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-100/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-[10s]" />
            <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] bg-indigo-50/30 blur-[100px] rounded-full pointer-events-none -z-10 anim-delay-2000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-12 relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <BoardHeader selectedYear={selectedYear} />
                </div>

                <div ref={gridRef} className="mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both scroll-mt-28">
                    <YearSelector
                        years={availableYears}
                        selectedYear={selectedYear}
                        onSelectYear={setSelectedYear}
                    />
                </div>
                <div className="relative">
                    {selectedBoard ? (
                        <div className="animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-both">
                            <BoardMemberGrid board={selectedBoard} />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                            <div className="max-w-md mx-auto p-12 text-center rounded-[3rem] bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm">
                                <span className="material-symbols-rounded text-4xl text-slate-300 mb-4 block">
                                    cloud_off
                                </span>
                                <p className="text-slate-400 font-medium">
                                    No hay información disponible para este período.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
