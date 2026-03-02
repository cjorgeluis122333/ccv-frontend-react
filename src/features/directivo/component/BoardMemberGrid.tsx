import type { BoardMember, BoardYear } from "../types/board";

interface BoardMemberCardProps {
    member: BoardMember;
    role: string;
}

const BoardMemberCard = ({ member, role }: BoardMemberCardProps) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:shadow-blue-100 hover:border-blue-200 group overflow-hidden relative">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

            {/* Photo Placeholder & Flags */}
            <div className="mt-8 relative z-10">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-rounded text-6xl text-slate-300">account_circle</span>
                </div>

            </div>

            <div className="p-8 pt-6 w-full relative z-10">
                <div className="mb-4">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-blue-100">
                        {role}
                    </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                    {member.nombre}
                </h3>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                        <span className="material-symbols-rounded text-sm">badge</span>
                        <span>CÉDULA: {member.cedula}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-blue-600 bg-blue-50/50 py-2 px-4 rounded-xl mx-auto">
                        <span className="material-symbols-rounded text-base">real_estate_agent</span>
                        <span>ACCIÓN: {member.acc}</span>
                    </div>
                </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            {roles.map((role) => {
                const member = board[role.key as keyof BoardYear] as BoardMember;
                if (!member) return null;
                return <BoardMemberCard key={role.key} member={member} role={role.label} />;
            })}
        </div>
    );
};
