import React, { useState, useRef, useEffect } from 'react';
import { usePartners } from '../hooks/usePartners';
import type { Partner } from '../types/partnerResponseType';

export const PartnerDataScreen = () => {
    const { partners, searchTerm, setSearchTerm, isLoading } = usePartners();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        if (!e.target.value) {
            setSelectedPartner(null);
        }
    };

    const handleSelectPartner = (partner: Partner) => {
        setSelectedPartner(partner);
        setSearchTerm(partner.nombre);
        setIsDropdownOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <span className="material-symbols-rounded text-2xl block">badge</span>
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Datos del Socio
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">Búsqueda y consulta de información de socios.</p>
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative" ref={dropdownRef}>
                <label className="block text-sm font-bold text-slate-700 mb-2">Buscar Socio</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-slate-400 text-xl pointer-events-none">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula o número de acción (acc)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
                    />
                    {isLoading && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-blue-500 animate-spin">
                            progress_activity
                        </span>
                    )}
                </div>

                {/* Dropdown de resultados */}
                {isDropdownOpen && searchTerm.trim() !== '' && partners.length > 0 && (
                    <div className="absolute z-10 w-[calc(100%-3rem)] mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {partners.map((partner) => (
                            <div
                                key={partner.acc}
                                onClick={() => handleSelectPartner(partner)}
                                className="px-5 py-3.5 hover:bg-blue-50 cursor-pointer transition-colors group"
                            >
                                <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{partner.nombre}</div>
                                <div className="text-xs text-slate-500 flex gap-4 mt-1.5">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-rounded text-[14px]">tag</span>
                                        <span className="font-semibold text-slate-600">Acc: {partner.acc}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-rounded text-[14px]">badge</span>
                                        <span className="font-semibold text-slate-600">C.I: {partner.cedula}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {isDropdownOpen && searchTerm.trim() !== '' && !isLoading && partners.length === 0 && (
                    <div className="absolute z-10 w-[calc(100%-3rem)] mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-6 text-center text-sm text-slate-500 flex flex-col items-center">
                        <span className="material-symbols-rounded text-3xl mb-2 text-slate-300">search_off</span>
                        No se encontraron resultados
                    </div>
                )}
            </div>

            {/* Formulario de Datos */}
            <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-500 ${selectedPartner ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none grayscale-[0.2]'}`}>
                <div className="p-6 border-b border-slate-100 bg-slate-50/80">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-rounded text-indigo-500">person_book</span>
                        Información del Titular
                    </h2>
                </div>

                <div className="p-6 sm:p-8">
                    {!selectedPartner && (
                        <div className="text-center py-12 text-slate-400">
                            <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-rounded text-4xl text-slate-300">search</span>
                            </div>
                            <p className="font-medium">Seleccione un socio en el buscador<br />para visualizar sus datos</p>
                        </div>
                    )}

                    <div className={`grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-8 lg:gap-12 ${!selectedPartner ? 'hidden' : ''}`}>
                        {/* Foto placeholder */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-full aspect-square max-w-[220px] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                                {/* Cuando haya foto, se reemplazará este div por un img */}
                                <span className="material-symbols-rounded text-7xl text-slate-200 group-hover:scale-110 transition-transform duration-300">account_circle</span>
                                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                Foto de Perfil
                            </span>
                        </div>

                        {/* Campos del formulario */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                            <Field label="Acción (Acc)" value={selectedPartner?.acc} icon="tag" />
                            <Field label="Cédula" value={selectedPartner?.cedula} icon="badge" />
                            <Field label="Carnet" value={selectedPartner?.carnet || 'N/A'} icon="id_card" />

                            <div className="sm:col-span-2 lg:col-span-3">
                                <Field label="Nombre Completo" value={selectedPartner?.nombre} icon="person" />
                            </div>

                            <Field label="Celular" value={selectedPartner?.celular || 'N/A'} icon="phone_iphone" />
                            <Field label="Teléfono" value={selectedPartner?.telefono || 'N/A'} icon="call" />
                            <Field label="Correo Electrónico" value={selectedPartner?.correo || 'N/A'} icon="mail" />

                            <div className="sm:col-span-2 lg:col-span-3">
                                <Field label="Dirección" value={selectedPartner?.direccion || 'N/A'} icon="location_on" />
                            </div>

                            <Field label="Fecha Nacimiento" value={selectedPartner?.nacimiento} icon="cake" />
                            <Field label="Fecha Ingreso" value={selectedPartner?.ingreso || 'N/A'} icon="calendar_month" />
                            <Field label="Ocupación" value={selectedPartner?.ocupacion || 'N/A'} icon="work" />

                            <Field label="Cobrador" value={selectedPartner?.cobrador || 'N/A'} icon="account_balance_wallet" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, icon }: { label: string; value: string | number | undefined; icon: string }) => (
    <div className="space-y-1.5 group">
        <label className="text-[11px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-rounded text-[1.2em]">{icon}</span>
            {label}
        </label>
        <div className="px-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 font-semibold text-sm min-h-[46px] flex items-center shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all truncate">
            {value}
        </div>
    </div>
);
