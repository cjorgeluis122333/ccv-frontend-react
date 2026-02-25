import { useState, useEffect } from 'react';

// hook/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Configuramos un temporizador para actualizar el valor
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Si el valor cambia antes de que termine el delay, limpiamos el temporizador anterior
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}