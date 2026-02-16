import api from '@/lib/axios';


export const mainService = {
    clearSession: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    logout: async () => {
        return api.post('/logout').finally(() => {
            mainService.clearSession();
        });
    }
}