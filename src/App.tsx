// import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';

function App() {
    // const basename = import.meta.env.BASE_URL;
    return (
        // <BrowserRouter basename={basename}>
            <AppRouter />
        // </BrowserRouter>
    );
}

export default App
