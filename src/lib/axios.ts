import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://ugliest-aleece-jorgeluis-d39b7ba0.koyeb.app/api',
    baseURL: 'https://css-server-1.onrender.com\n/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor: Si ya tenemos token guardado, lo inyectamos automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // O usar cookies/zustand
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;