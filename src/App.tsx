import { ToastProvider } from '@/components/ui/toast/ToastProvider.tsx';
import { AppRouter } from './router/AppRouter';

function App() {
    return (
        <ToastProvider>
            <AppRouter />
        </ToastProvider>
    );
}

export default App
