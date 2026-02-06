export interface NavItem {
    title: string;
    path: string;
    icon: string; // Nombre del Material Symbol
    description?: string; // Nuevo: Para el Dashboard
    color?: string; // Nuevo: Para dar identidad visual (ej.: "text-blue-600")
}

export interface NavSection {
    title: string;
    icon?: string;
    items: NavItem[];
}
