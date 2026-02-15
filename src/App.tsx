// import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/Toast/Toast';

const ToastWrapper = () => {
    const { toasts, hideToast } = useToast();
    return <ToastContainer toasts={toasts} hideToast={hideToast} />;
};

function App() {
    // const basename = import.meta.env.BASE_URL;
    return (
        <ToastProvider>
            <ToastWrapper />
            <AppRouter />
        </ToastProvider>
    );
}

export default App
