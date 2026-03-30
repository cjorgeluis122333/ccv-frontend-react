export interface Guest {
    ind: number;
    cedula: number;
    nombre: string;
    fecha: string;
    acc: number;
    fuente: string;
    operador: string;
}

export interface GuestPayload {
    cedula: string;
    nombre: string;
    fecha: string;
    acc: number;
    fuente: string | null;
    operador: string;
}

export interface GuestYearData {
    anio: number;
    meses: Record<string, Guest[]>;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface GuestPaginatedResponse {
    current_page: number;
    data: GuestYearData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
