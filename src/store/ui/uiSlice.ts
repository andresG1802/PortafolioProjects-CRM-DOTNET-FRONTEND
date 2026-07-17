import { createSlice } from '@reduxjs/toolkit';

interface UiState {
    isCustomerModalOpen: boolean;
    isContactModalOpen: boolean;
    isLeadModalOpen: boolean;
    isDealModalOpen: boolean;
    isActivityModalOpen: boolean;
}

const initialState: UiState = {
    isCustomerModalOpen: false,
    isContactModalOpen: false,
    isLeadModalOpen: false,
    isDealModalOpen: false,
    isActivityModalOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        onOpenCustomerModal: (state) => { state.isCustomerModalOpen = true; },
        onCloseCustomerModal: (state) => { state.isCustomerModalOpen = false; },
        onOpenContactModal: (state) => { state.isContactModalOpen = true; },
        onCloseContactModal: (state) => { state.isContactModalOpen = false; },
        onOpenLeadModal: (state) => { state.isLeadModalOpen = true; },
        onCloseLeadModal: (state) => { state.isLeadModalOpen = false; },
        onOpenDealModal: (state) => { state.isDealModalOpen = true; },
        onCloseDealModal: (state) => { state.isDealModalOpen = false; },
        onOpenActivityModal: (state) => { state.isActivityModalOpen = true; },
        onCloseActivityModal: (state) => { state.isActivityModalOpen = false; },
    },
});

export const {
    onOpenCustomerModal,
    onCloseCustomerModal,
    onOpenContactModal,
    onCloseContactModal,
    onOpenLeadModal,
    onCloseLeadModal,
    onOpenDealModal,
    onCloseDealModal,
    onOpenActivityModal,
    onCloseActivityModal,
} = uiSlice.actions;
