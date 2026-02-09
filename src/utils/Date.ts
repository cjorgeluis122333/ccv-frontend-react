// Función para calcular la edad basándonos en el año actual (2026)
export const calculateAge = (birthDate: string) => {
    if (!birthDate || birthDate.startsWith('0')) return 'N/A';
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = 2026; // Año actual según el contexto
    return currentYear - birthYear;
};