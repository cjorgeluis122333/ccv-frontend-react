import type { BoardMember, BoardYear } from "../types/board";

interface BoardMemberCardProps {
    member: BoardMember;
    role: string;
}

const BoardMemberCard = ({ member, role }: BoardMemberCardProps) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-blue-100 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="material-symbols-rounded text-2xl">person</span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{role}</h3>
            <p className="text-sm font-bold text-slate-800 mb-2">{member.nombre}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                <span className="material-symbols-rounded text-sm">badge</span>
                <span>{member.cedula}</span>
            </div>
        </div>
    );
};

interface BoardMemberGridProps {
    board: BoardYear;
}

export const BoardMemberGrid = ({ board }: BoardMemberGridProps) => {
    const roles = [
        { key: "presidente", label: "Presidente" },
        { key: "vicepresidente", label: "Vicepresidente" },
        { key: "secretario", label: "Secretario" },
        { key: "vicesecretario", label: "Vicesecretario" },
        { key: "tesorero", label: "Tesorero" },
        { key: "vicetesorero", label: "Vicetesorero" },
        { key: "bibliotecario", label: "Bibliotecario" },
        { key: "actas", label: "Actas" },
        { key: "viceactas", label: "Viceactas" },
        { key: "actos", label: "Actos" },
        { key: "deportes", label: "Deportes" },
        { key: "vocal1", label: "Vocal 1" },
        { key: "vocal2", label: "Vocal 2" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {roles.map((role) => {
                const member = board[role.key as keyof BoardYear] as BoardMember;
                if (!member) return null;
                return <BoardMemberCard key={role.key} member={member} role={role.label} />;
            })}
        </div>
    );
};
