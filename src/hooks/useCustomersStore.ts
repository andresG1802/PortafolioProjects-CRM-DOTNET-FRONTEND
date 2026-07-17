import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddContact,
    onAddCustomer,
    onAddNote,
    onClearActiveCustomer,
    onDeleteContact,
    onDeleteCustomer,
    onDeleteNote,
    onSetActiveCustomer,
    onSetContacts,
    onSetCustomers,
    onSetNotes,
    onUpdateContact,
    onUpdateCustomer,
} from '../store';
import { Contact, ContactPayload, Customer, CustomerPayload, Note, PagedResponse } from '../types';
import { getApiErrorMessage } from '../helpers';

export const useCustomersStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingCustomers, customers, activeCustomer, contacts, notes } = useAppSelector((state) => state.customers);

    const startLoadingCustomers = async (search?: string) => {
        try {
            const { data } = await crmApi.get<PagedResponse<Customer>>('/customers', {
                params: { pageSize: 100, search: search || undefined },
            });
            dispatch(onSetCustomers(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
        }
    };

    const startSavingCustomer = async (customerData: CustomerPayload): Promise<boolean> => {
        try {
            if (customerData.id) {
                const { data } = await crmApi.put(`/customers/${customerData.id}`, customerData);
                dispatch(onUpdateCustomer(data));
            } else {
                const { data } = await crmApi.post('/customers', customerData);
                dispatch(onAddCustomer(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar el cliente'), 'error');
            return false;
        }
    };

    const startDeletingCustomer = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar cliente?',
            text: 'Se eliminarán también sus contactos y oportunidades asociadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/customers/${id}`);
            dispatch(onDeleteCustomer(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar el cliente'), 'error');
        }
    };

    const startLoadingCustomerDetail = async (id: string) => {
        try {
            const { data } = await crmApi.get<Customer>(`/customers/${id}`);
            dispatch(onSetActiveCustomer(data));
            await Promise.all([startLoadingContacts(id), startLoadingNotes(id)]);
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el cliente', 'error');
        }
    };

    const setActiveCustomer = (customer: Customer) => dispatch(onSetActiveCustomer(customer));
    const clearActiveCustomer = () => dispatch(onClearActiveCustomer());

    const startLoadingContacts = async (customerId: string) => {
        try {
            const { data } = await crmApi.get<PagedResponse<Contact>>('/contacts', {
                params: { customerId, pageSize: 100 },
            });
            dispatch(onSetContacts(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los contactos', 'error');
        }
    };

    const startSavingContact = async (contactData: ContactPayload): Promise<boolean> => {
        try {
            if (contactData.id) {
                const { data } = await crmApi.put(`/contacts/${contactData.id}`, contactData);
                dispatch(onUpdateContact(data));
            } else {
                const { data } = await crmApi.post('/contacts', { ...contactData, customerId: activeCustomer?.id });
                dispatch(onAddContact(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar el contacto'), 'error');
            return false;
        }
    };

    const startDeletingContact = async (id: string) => {
        try {
            await crmApi.delete(`/contacts/${id}`);
            dispatch(onDeleteContact(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar el contacto'), 'error');
        }
    };

    const startLoadingNotes = async (customerId: string) => {
        try {
            const { data } = await crmApi.get<PagedResponse<Note>>('/notes', {
                params: { customerId, pageSize: 100 },
            });
            dispatch(onSetNotes(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las notas', 'error');
        }
    };

    const startSavingNote = async (content: string) => {
        try {
            const { data } = await crmApi.post('/notes', { content, customerId: activeCustomer?.id });
            dispatch(onAddNote(data));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar la nota'), 'error');
        }
    };

    const startDeletingNote = async (id: string) => {
        try {
            await crmApi.delete(`/notes/${id}`);
            dispatch(onDeleteNote(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar la nota'), 'error');
        }
    };

    return {
        isLoadingCustomers,
        customers,
        activeCustomer,
        contacts,
        notes,

        startLoadingCustomers,
        startSavingCustomer,
        startDeletingCustomer,
        startLoadingCustomerDetail,
        setActiveCustomer,
        clearActiveCustomer,

        startSavingContact,
        startDeletingContact,

        startSavingNote,
        startDeletingNote,
    };
};
