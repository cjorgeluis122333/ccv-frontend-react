/**
 * Extrae el mes y el año de una fecha (ej. "2025-01-15" o objeto Date)
 * Retorna en formato "YYYY-MM"
 */
export const formatToYearMonth = (dateString: string): string => {
    if (!dateString) return '';
    // Si viene "YYYY-MM-DD" tomamos solo lo primero
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length >= 2) {
            return `${parts[0]}-${parts[1]}`;
        }
    }
    return dateString;
};

/**
 * Convierte un "YYYY-MM" al primer día del mes "YYYY-MM-01"
 * Útil para poner en inputs de tipo date que no admiten mes solo fácilmente sin librerías o hacks.
 */
export const getFirstDayOfMonth = (yearMonth: string): string => {
    if (!yearMonth) return '';
    if (yearMonth.length === 7 && yearMonth.includes('-')) {
        return `${yearMonth}-01`;
    }
    return yearMonth;
};

/**
 * Retorna true si format "YYYY-MM"
 */
export const isYearMonthFormat = (val: string) => {
    return /^\d{4}-\d{2}$/.test(val);
}
