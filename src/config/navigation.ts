export interface NavItem {
    title: string;
    path: string;
    icon?: string;
}

export interface NavSection {
    title: string; // Título de la sección (ej: Pagos)
    icon?: string;
    items: NavItem[]; // Enlaces dentro de la sección
}

// Secciones con desplegables (Acordeón)
export const menuSections: NavSection[] = [
    {
        title: 'Pagos',
        icon: 'payments',
        items: [
            { title: 'Pagos', path: '/pagos' },
            { title: 'Operaciones', path: '/operaciones' },
            { title: 'Reportes', path: '/reportes' },
            { title: 'Ventas', path: '/ventas' },
        ],
    },
    {
        title: 'Solvencia',
        icon: 'verified',
        items: [
            { title: 'Solvencia', path: '/solvencia' },
            { title: 'Cuotas', path: '/cuotas' },
        ],
    },
    {
        title: 'Socios',
        icon: 'groups',
        items: [
            { title: 'Datos', path: '/socios/datos' },
            { title: 'Lista', path: '/socios/lista' },
            { title: 'Directivos', path: '/socios/directivos' },
        ],
    },
];

// Enlaces sueltos (parte inferior)
export const standaloneLinks: NavItem[] = [
    { title: 'Invitados', path: '/invitados', icon: 'person_add' },
    { title: 'Notificaciones', path: '/notificaciones', icon: 'notifications' },
    { title: 'Mi Cuenta', path: '/mi-cuenta', icon: 'account_circle' },
];