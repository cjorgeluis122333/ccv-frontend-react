import { useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseGenericFilterProps<T> {
    items: T[];
    searchTerm: string;
    // Función que define bajo qué criterios se filtra
    filterFn: (item: T, term: string) => boolean;
    debounceMs?: number;
    maxResults?: number;
}

export const useGenericFilter = <T,>({
                                         items,
                                         searchTerm,
                                         filterFn,
                                         debounceMs = 400,
                                         maxResults = 50
                                     }: UseGenericFilterProps<T>) => {

    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

    // Bandera para saber si estamos esperando al debounce
    const isFiltering = searchTerm.trim() !== debouncedSearchTerm.trim();

    const filteredItems = useMemo(() => {
        const term = debouncedSearchTerm.toLowerCase().trim();
        if (!term) return [];

        return items
            .filter(item => filterFn(item, term))
            .slice(0, maxResults);
    }, [debouncedSearchTerm, items, filterFn, maxResults]);

    return {
        filteredItems,
        isFiltering,
        debouncedSearchTerm
    };
};