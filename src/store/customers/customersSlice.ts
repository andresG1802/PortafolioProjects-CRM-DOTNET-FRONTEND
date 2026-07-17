import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact, Customer, Note } from '../../types';

interface CustomersState {
    isLoadingCustomers: boolean;
    customers: Customer[];
    activeCustomer: Customer | null;
    contacts: Contact[];
    notes: Note[];
}

const initialState: CustomersState = {
    isLoadingCustomers: true,
    customers: [],
    activeCustomer: null,
    contacts: [],
    notes: [],
};

export const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        onSetCustomers: (state, { payload }: PayloadAction<Customer[]>) => {
            state.isLoadingCustomers = false;
            state.customers = payload;
        },
        onAddCustomer: (state, { payload }: PayloadAction<Customer>) => {
            state.customers.push(payload);
        },
        onUpdateCustomer: (state, { payload }: PayloadAction<Customer>) => {
            state.customers = state.customers.map((customer) => (customer.id === payload.id ? payload : customer));
            if (state.activeCustomer?.id === payload.id) state.activeCustomer = payload;
        },
        onDeleteCustomer: (state, { payload }: PayloadAction<string>) => {
            state.customers = state.customers.filter((customer) => customer.id !== payload);
        },
        onSetActiveCustomer: (state, { payload }: PayloadAction<Customer>) => {
            state.activeCustomer = payload;
            state.contacts = [];
            state.notes = [];
        },
        onClearActiveCustomer: (state) => {
            state.activeCustomer = null;
            state.contacts = [];
            state.notes = [];
        },
        onSetContacts: (state, { payload }: PayloadAction<Contact[]>) => {
            state.contacts = payload;
        },
        onAddContact: (state, { payload }: PayloadAction<Contact>) => {
            state.contacts.push(payload);
        },
        onUpdateContact: (state, { payload }: PayloadAction<Contact>) => {
            state.contacts = state.contacts.map((contact) => (contact.id === payload.id ? payload : contact));
        },
        onDeleteContact: (state, { payload }: PayloadAction<string>) => {
            state.contacts = state.contacts.filter((contact) => contact.id !== payload);
        },
        onSetNotes: (state, { payload }: PayloadAction<Note[]>) => {
            state.notes = payload;
        },
        onAddNote: (state, { payload }: PayloadAction<Note>) => {
            state.notes.unshift(payload);
        },
        onDeleteNote: (state, { payload }: PayloadAction<string>) => {
            state.notes = state.notes.filter((note) => note.id !== payload);
        },
    },
});

export const {
    onSetCustomers,
    onAddCustomer,
    onUpdateCustomer,
    onDeleteCustomer,
    onSetActiveCustomer,
    onClearActiveCustomer,
    onSetContacts,
    onAddContact,
    onUpdateContact,
    onDeleteContact,
    onSetNotes,
    onAddNote,
    onDeleteNote,
} = customersSlice.actions;
