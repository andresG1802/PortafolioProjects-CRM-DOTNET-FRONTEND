import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead } from '../../types';

interface LeadsState {
    isLoadingLeads: boolean;
    leads: Lead[];
    activeLead: Lead | null;
}

const initialState: LeadsState = {
    isLoadingLeads: true,
    leads: [],
    activeLead: null,
};

export const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        onSetLeads: (state, { payload }: PayloadAction<Lead[]>) => {
            state.isLoadingLeads = false;
            state.leads = payload;
        },
        onAddLead: (state, { payload }: PayloadAction<Lead>) => {
            state.leads.push(payload);
        },
        onUpdateLead: (state, { payload }: PayloadAction<Lead>) => {
            state.leads = state.leads.map((lead) => (lead.id === payload.id ? payload : lead));
        },
        onDeleteLead: (state, { payload }: PayloadAction<string>) => {
            state.leads = state.leads.filter((lead) => lead.id !== payload);
        },
        onSetActiveLead: (state, { payload }: PayloadAction<Lead>) => {
            state.activeLead = payload;
        },
        onClearActiveLead: (state) => {
            state.activeLead = null;
        },
    },
});

export const {
    onSetLeads,
    onAddLead,
    onUpdateLead,
    onDeleteLead,
    onSetActiveLead,
    onClearActiveLead,
} = leadsSlice.actions;
