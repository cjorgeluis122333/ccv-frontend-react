import { usePartners } from '../hooks/usePartners';
import { Pagination } from '@/components/ui/Pagination';
import { PartnersTable } from "@/features/partner/component/PartnersTable.tsx";

export const PartnersList = () => {
    const { 
        partners, 
        pagination, 
        isLoading, 
        error, 
        nextPage, 
        prevPage, 
        refresh,
        searchTerm,
        setSearchTerm 
    } = usePartners();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto">

            {/* Header de la Página */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <span className="material-symbols-rounded text-2xl">group</span>
                        </span>
                        Directorio de Socios
                    </h1>
                    <p className="text-slate-500 font-medium">Gestión y visualización de la base de datos de miembros.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    {/* Barra de Búsqueda */}
                    <div className="relative flex-1 sm:w-80">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-xl pointer-events-none">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, cédula o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-rounded text-lg">close</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={refresh}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 font-semibold text-sm"
                            title="Recargar tabla"
                        >
                            <span className="material-symbols-rounded text-xl">refresh</span>
                            <span>Actualizar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Manejo de Errores */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3 animate-shake">
                    <span className="material-symbols-rounded">error</span>
                    {error}
                </div>
            )}

            {/* Contenedor Principal de Datos */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <PartnersTable data={partners} isLoading={isLoading} />

                {/* Paginación */}
                {!isLoading && pagination && partners.length > 0 && !searchTerm && (
                    <div className="bg-slate-50/50">
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
                    </div>
                )}
                
                {/* Estado de búsqueda sin resultados */}
                {!isLoading && partners.length === 0 && searchTerm && (
                    <div className="p-20 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full text-slate-300">
                            <span className="material-symbols-rounded text-5xl">search_off</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">No hay coincidencias</h3>
                            <p className="text-slate-500">No encontramos ningún socio que coincida con "{searchTerm}"</p>
                        </div>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
