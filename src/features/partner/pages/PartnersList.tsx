import { usePartners } from '../hooks/usePartners';
import { Pagination } from '@/components/ui/Pagination';
import {PartnersTable} from "@/features/partner/component/PartnersTable.tsx";

export const PartnersList = () => {
    const { partners, pagination, isLoading, error, nextPage, prevPage, refresh } = usePartners();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header de la Página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Directorio de Socios</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestión y visualización de la base de datos de miembros.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refresh}
                        className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        title="Recargar tabla"
                    >
                        <span className="material-symbols-rounded text-xl">refresh</span>
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-rounded text-lg">add</span>
                        Nuevo Socio
                    </button>
                </div>
            </div>

            {/* Manejo de Errores */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                    <span className="material-symbols-rounded">error</span>
                    {error}
                </div>
            )}

            {/* Tabla de Datos */}
            <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                <PartnersTable data={partners} isLoading={isLoading} />

                {/* Paginación (Solo se muestra si hay datos y paginación disponible) */}
                {!isLoading && pagination && partners.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        total={pagination.total}
                        from={pagination.from}
                        to={pagination.to}
                        onNext={nextPage}
                        onPrev={prevPage}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};