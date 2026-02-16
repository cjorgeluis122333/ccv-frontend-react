// import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast/ToastProvider.tsx';
import { AppRouter } from './router/AppRouter';

function App() {
    // const basename = import.meta.env.BASE_URL;
    return (
        <ToastProvider>
            <AppRouter />
        </ToastProvider>
    );
}

export default App
