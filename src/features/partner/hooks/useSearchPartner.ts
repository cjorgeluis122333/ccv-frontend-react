// hooks/useSearchPartner.ts
import React, { useState, useRef, useEffect } from 'react';

export const useSearchPartner = (
    setSearchTerm: (val: string) => void,
    onClearSearch: () => void
) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Manejar el input de búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        if (!e.target.value) {
            onClearSearch();
        }
    };

    return {
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        handleSearchChange
    };
};