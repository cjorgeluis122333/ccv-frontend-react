// src/config/navigation.ts

// --- Configuración de Datos ---

import type {NavItem, NavSection} from "@/types/navigationTypes.ts";

export const menuSections: NavSection[] = [
    {
        title: "Finanzas",
        icon: "payments",
        items: [
            {
                title: "Pagos",
                path: "/pagos",
                icon: "attach_money",
                description: "Gestionar historial y nuevos pagos",
                color: "text-emerald-600 bg-emerald-50"
            },
            {
                title: "Operaciones",
                path: "/operaciones",
                icon: "sync_alt",
                description: "Movimientos y transacciones",
                color: "text-blue-600 bg-blue-50"
            },
            {
                title: "Reportes",
                path: "/reportes",
                icon: "bar_chart",
                description: "Análisis financiero y estadísticas",
                color: "text-indigo-600 bg-indigo-50"
            },
            {
                title: "Ventas",
                path: "/ventas",
                icon: "shopping_cart",
                description: "Registro de ventas diarias",
                color: "text-cyan-600 bg-cyan-50"
            }
        ]
    },
    {
        title: "Estado de Cuenta",
        icon: "account_balance_wallet",
        items: [
            {
                title: "Solvencia",
                path: "/solvencia",
                icon: "verified",
                description: "Certificados y estados de solvencia",
                color: "text-purple-600 bg-purple-50"
            },
            {
                title: "Cuotas",
                path: "/cuotas",
                icon: "receipt_long",
                description: "Calendario de cuotas pendientes",
                color: "text-violet-600 bg-violet-50"
            }
        ]
    },
    {
        title: "Gestión de Socios",
        icon: "groups",
        items: [
            {
                title: "Datos del Socio",
                path: "/socios/datos",
                icon: "person",
                description: "Información personal y contacto",
                color: "text-orange-600 bg-orange-50"
            },
            {
                title: "Lista de Socios",
                path: "/socios/lista",
                icon: "format_list_bulleted",
                description: "Directorio completo de miembros",
                color: "text-amber-600 bg-amber-50"
            },
            {
                title: "Directivos",
                path: "/socios/directivos",
                icon: "badge",
                description: "Junta directiva y administración",
                color: "text-yellow-600 bg-yellow-50"
            }
        ]
    }
];

export const standaloneLinks: NavItem[] = [
    {
        title: "Invitados",
        path: "/invitados",
        icon: "passkey",
        description: "Control de acceso para visitantes",
        color: "text-pink-600 bg-pink-50"
    },
    {
        title: "Notificaciones",
        path: "/notificaciones",
        icon: "notifications",
        description: "Centro de alertas y mensajes",
        color: "text-slate-600 bg-slate-50"
    },
    {
        title: "Mi Cuenta",
        path: "/mi-cuenta",
        icon: "settings",
        description: "Configuración de perfil y seguridad",
        color: "text-slate-600 bg-slate-50"
    }
];