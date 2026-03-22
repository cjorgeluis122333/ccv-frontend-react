import { ToastProvider } from '@/components/ui/toast/ToastProvider.tsx';
import { AppRouter } from './router/AppRouter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
    return (
        <ToastProvider>
            <AppRouter />
            <Analytics />
            <SpeedInsights />
        </ToastProvider>
    );
}

export default App
