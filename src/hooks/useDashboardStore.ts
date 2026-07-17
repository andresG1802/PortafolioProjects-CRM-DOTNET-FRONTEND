import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { onSetSummary } from '../store';
import { DashboardSummary } from '../types';

export const useDashboardStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingSummary, summary } = useAppSelector((state) => state.dashboard);

    const startLoadingSummary = async () => {
        try {
            const { data } = await crmApi.get<DashboardSummary>('/dashboard/summary');
            dispatch(onSetSummary(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el resumen', 'error');
        }
    };

    return {
        isLoadingSummary,
        summary,

        startLoadingSummary,
    };
};
