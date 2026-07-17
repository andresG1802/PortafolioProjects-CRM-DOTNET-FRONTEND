import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '../../types';

interface DealsState {
    isLoadingDeals: boolean;
    deals: Deal[];
    activeDeal: Deal | null;
}

const initialState: DealsState = {
    isLoadingDeals: true,
    deals: [],
    activeDeal: null,
};

export const dealsSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        onSetDeals: (state, { payload }: PayloadAction<Deal[]>) => {
            state.isLoadingDeals = false;
            state.deals = payload;
        },
        onAddDeal: (state, { payload }: PayloadAction<Deal>) => {
            state.deals.push(payload);
        },
        onUpdateDeal: (state, { payload }: PayloadAction<Deal>) => {
            state.deals = state.deals.map((deal) => (deal.id === payload.id ? payload : deal));
        },
        onDeleteDeal: (state, { payload }: PayloadAction<string>) => {
            state.deals = state.deals.filter((deal) => deal.id !== payload);
        },
        onSetActiveDeal: (state, { payload }: PayloadAction<Deal>) => {
            state.activeDeal = payload;
        },
        onClearActiveDeal: (state) => {
            state.activeDeal = null;
        },
    },
});

export const {
    onSetDeals,
    onAddDeal,
    onUpdateDeal,
    onDeleteDeal,
    onSetActiveDeal,
    onClearActiveDeal,
} = dealsSlice.actions;
