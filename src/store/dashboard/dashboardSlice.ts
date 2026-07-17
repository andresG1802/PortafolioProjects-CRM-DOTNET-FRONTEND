import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardSummary } from '../../types';

interface DashboardState {
    isLoadingSummary: boolean;
    summary: DashboardSummary | null;
}

const initialState: DashboardState = {
    isLoadingSummary: true,
    summary: null,
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        onSetSummary: (state, { payload }: PayloadAction<DashboardSummary>) => {
            state.isLoadingSummary = false;
            state.summary = payload;
        },
    },
});

export const { onSetSummary } = dashboardSlice.actions;
