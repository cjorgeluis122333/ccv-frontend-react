import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';


export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<div>Dashboard (Protegido)</div>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};