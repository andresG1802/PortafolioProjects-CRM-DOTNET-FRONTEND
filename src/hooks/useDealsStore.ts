import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddDeal,
    onClearActiveDeal,
    onDeleteDeal,
    onSetActiveDeal,
    onSetDeals,
    onUpdateDeal,
} from '../store';
import { Deal, DealPayload, PagedResponse } from '../types';
import { getApiErrorMessage } from '../helpers';

export const useDealsStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingDeals, deals, activeDeal } = useAppSelector((state) => state.deals);

    const startLoadingDeals = async () => {
        try {
            const { data } = await crmApi.get<PagedResponse<Deal>>('/deals', { params: { pageSize: 100 } });
            dispatch(onSetDeals(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las oportunidades', 'error');
        }
    };

    const startSavingDeal = async (dealData: DealPayload): Promise<boolean> => {
        try {
            if (dealData.id) {
                const { data } = await crmApi.put(`/deals/${dealData.id}`, dealData);
                dispatch(onUpdateDeal(data));
            } else {
                const { data } = await crmApi.post('/deals', dealData);
                dispatch(onAddDeal(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar la oportunidad'), 'error');
            return false;
        }
    };

    const startDeletingDeal = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar oportunidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/deals/${id}`);
            dispatch(onDeleteDeal(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar la oportunidad'), 'error');
        }
    };

    const setActiveDeal = (deal: Deal) => dispatch(onSetActiveDeal(deal));
    const clearActiveDeal = () => dispatch(onClearActiveDeal());

    return {
        isLoadingDeals,
        deals,
        activeDeal,

        startLoadingDeals,
        startSavingDeal,
        startDeletingDeal,
        setActiveDeal,
        clearActiveDeal,
    };
};
