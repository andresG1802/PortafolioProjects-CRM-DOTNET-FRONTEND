import axios from 'axios';

const crmApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

crmApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

crmApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.startsWith('/auth')) {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    },
);

export default crmApi;
