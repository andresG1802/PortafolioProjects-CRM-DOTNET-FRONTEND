import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { onChecking, onLogin, onLogout } from '../store';
import { AuthUser } from '../types';
import { getApiErrorMessage } from '../helpers';

interface Credentials {
    email: string;
    password: string;
}

interface RegisterData extends Credentials {
    fullName: string;
}

interface AuthResponse extends AuthUser {
    token: string;
}

export const useAuthStore = () => {
    const dispatch = useAppDispatch();
    const { status, user, errorMessage } = useAppSelector((state) => state.auth);

    const startLogin = async ({ email, password }: Credentials) => {
        dispatch(onChecking());
        try {
            const { data } = await crmApi.post<AuthResponse>('/auth/login', { email, password });
            const { token, ...authUser } = data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(authUser));
            dispatch(onLogin(authUser));
        } catch (error: any) {
            dispatch(onLogout(getApiErrorMessage(error, 'Credenciales incorrectas')));
        }
    };

    const startRegister = async ({ fullName, email, password }: RegisterData) => {
        dispatch(onChecking());
        try {
            const { data } = await crmApi.post<AuthResponse>('/auth/register', { fullName, email, password });
            const { token, ...authUser } = data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(authUser));
            dispatch(onLogin(authUser));
        } catch (error: any) {
            dispatch(onLogout(getApiErrorMessage(error, 'No se pudo registrar el usuario')));
        }
    };

    const checkAuthToken = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            dispatch(onLogout(undefined));
            return;
        }

        dispatch(onLogin(JSON.parse(user)));
    };

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(onLogout(undefined));
    };

    return {
        status,
        user,
        errorMessage,

        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    };
};
