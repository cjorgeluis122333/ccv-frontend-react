import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from '@/features/auth/LoginScreen.tsx';
import { RegisterScreen } from '@/features/auth/RegisterScreen.tsx';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from "@/features/dashboard/component/DashboardScreen.tsx";
import { PartnersList } from '@/features/partner/pages/PartnersList';
import { PartnerDataScreen } from '@/features/partner/pages/PartnerDataScreen';

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Rutas Protegidas (Layout con Drawer) */}
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Pagos */}
                <Route path="/pagos" element={<div>Pantalla de Pagos</div>} />
                <Route path="/operaciones" element={<div>Pantalla de Operaciones</div>} />
                <Route path="/reportes" element={<div>Pantalla de Reportes</div>} />
                <Route path="/ventas" element={<div>Pantalla de Ventas</div>} />

                {/* Solvencia */}
                <Route path="/solvencia" element={<div>Pantalla de Solvencia</div>} />
                <Route path="/cuotas" element={<div>Pantalla de Cuotas</div>} />

                {/* Socios */}
                <Route path="/socios/datos" element={<PartnerDataScreen />} />
                <Route path="/socios/lista" element={<PartnersList />} />
                <Route path="/socios/directivos" element={<div>Directivos</div>} />

                {/* Generales */}
                <Route path="/invitados" element={<div>Gestión de Invitados</div>} />
                <Route path="/notificaciones" element={<div>Mis Notificaciones</div>} />
                <Route path="/mi-cuenta" element={<div>Perfil de Usuario</div>} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};