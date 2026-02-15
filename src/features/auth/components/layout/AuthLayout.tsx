// src/components/layouts/AuthLayout.tsx
import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
        <div className="w-full max-w-[400px] bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 text-sm">{subtitle}</p>
            </div>
            {children}
        </div>
    </div>
);