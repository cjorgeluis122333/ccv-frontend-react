export interface BoardMember {
    ind: number;
    cedula: number;
    nombre: string;
    acc: number;
}

export interface BoardYear {
    year: number;
    presidente: BoardMember;
    vicepresidente: BoardMember;
    secretario: BoardMember;
    vicesecretario: BoardMember;
    tesorero: BoardMember;
    vicetesorero: BoardMember;
    bibliotecario: BoardMember;
    actas: BoardMember;
    viceactas: BoardMember;
    actos: BoardMember;
    deportes: BoardMember;
    vocal1: BoardMember;
    vocal2: BoardMember;
}

export interface BoardResponse {
    status: string;
    message: string;
    data: BoardYear[];
}
