import { ToastProvider } from '@/components/ui/toast/ToastProvider.tsx';
import { AppRouter } from './router/AppRouter';
import { Analytics } from '@vercel/analytics/react';

function App() {
    return (
        <ToastProvider>
            <AppRouter />
            <Analytics />
        </ToastProvider>
    );
}

export default App
