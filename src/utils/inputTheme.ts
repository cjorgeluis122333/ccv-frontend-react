export interface InputStyleConfig {
    container: string;
    label: string;
    input: string;
    iconSize: string;
}

export const INPUT_THEMES = {
    indigo: {
        container: "space-y-1.5",
        label: "text-[11px] group-focus-within:text-indigo-600 tracking-wider",
        input: "px-4 py-3 bg-white h-[46px] rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500",
        iconSize: "text-[1.2em]"
    },
    fuchsia: {
        container: "space-y-1",
        label: "text-[10px] group-focus-within:text-fuchsia-600 tracking-widest",
        input: "px-3 py-2 bg-slate-50 h-[38px] rounded-lg focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500",
        iconSize: "text-[14px]"
    }
};