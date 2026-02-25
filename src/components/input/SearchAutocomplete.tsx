import type {ChangeEvent, RefObject, ReactNode} from 'react';

// Definimos las propiedades usando un genérico <T>
interface GenericSearchProps<T> {
    label: string;
    placeholder?: string;
    searchTerm: string;
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    isLoading: boolean;
    isDropdownOpen: boolean;
    items: T[];
    // Funciones clave para hacer el componente 100% agnóstico al dato:
    onSelectItem: (item: T) => void;
    keyExtractor: (item: T) => string | number; // Extrae el ID único del objeto
    renderItem: (item: T) => ReactNode; // Define cómo se dibuja visualmente el objeto
    dropdownRef: RefObject<HTMLDivElement | null>;
}

export const GenericSearch = <T,>({
                                      label,
                                      placeholder = "Buscar...",
                                      searchTerm,
                                      onSearchChange,
                                      onFocus,
                                      isLoading,
                                      isDropdownOpen,
                                      items,
                                      onSelectItem,
                                      keyExtractor,
                                      renderItem,
                                      dropdownRef
                                  }: GenericSearchProps<T>) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative z-10" ref={dropdownRef}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-xl pointer-events-none">
                    search
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={onSearchChange}
                    onFocus={onFocus}
                    className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                />
                {isLoading && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-indigo-500 animate-spin">
                        progress_activity
                    </span>
                )}
            </div>

            {/* Dropdown Genérico */}
            {isDropdownOpen && searchTerm.trim() !== '' && items.length > 0 && (
                <div className="absolute z-50 w-[calc(100%-3rem)] mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {items.map((item) => (
                        <div
                            key={keyExtractor(item)}
                            onClick={() => onSelectItem(item)}
                            className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            {/* Delegamos el dibujo del item al componente padre */}
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};