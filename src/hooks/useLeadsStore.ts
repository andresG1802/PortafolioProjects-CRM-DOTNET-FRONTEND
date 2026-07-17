import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddLead,
    onClearActiveLead,
    onDeleteLead,
    onSetActiveLead,
    onSetLeads,
    onUpdateLead,
} from '../store';
import { Lead, LeadPayload, PagedResponse } from '../types';
import { getApiErrorMessage } from '../helpers';

export const useLeadsStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingLeads, leads, activeLead } = useAppSelector((state) => state.leads);

    const startLoadingLeads = async () => {
        try {
            const { data } = await crmApi.get<PagedResponse<Lead>>('/leads', { params: { pageSize: 100 } });
            dispatch(onSetLeads(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los leads', 'error');
        }
    };

    const startSavingLead = async (leadData: LeadPayload): Promise<boolean> => {
        try {
            if (leadData.id) {
                const { data } = await crmApi.put(`/leads/${leadData.id}`, leadData);
                dispatch(onUpdateLead(data));
            } else {
                const { data } = await crmApi.post('/leads', leadData);
                dispatch(onAddLead(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar el lead'), 'error');
            return false;
        }
    };

    const startDeletingLead = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar lead?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/leads/${id}`);
            dispatch(onDeleteLead(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar el lead'), 'error');
        }
    };

    const setActiveLead = (lead: Lead) => dispatch(onSetActiveLead(lead));
    const clearActiveLead = () => dispatch(onClearActiveLead());

    return {
        isLoadingLeads,
        leads,
        activeLead,

        startLoadingLeads,
        startSavingLead,
        startDeletingLead,
        setActiveLead,
        clearActiveLead,
    };
};
