import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../types';

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

interface AuthState {
    status: AuthStatus;
    user: AuthUser | Record<string, never>;
    errorMessage?: string;
}

const initialState: AuthState = {
    status: 'checking',
    user: {},
    errorMessage: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        onChecking: (state) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }: PayloadAction<AuthUser>) => {
            state.status = 'authenticated';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }: PayloadAction<string | undefined>) => {
            state.status = 'not-authenticated';
            state.user = {};
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        },
    },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;
