import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddActivity,
    onClearActiveActivity,
    onDeleteActivity,
    onSetActiveActivity,
    onSetActivities,
    onUpdateActivity,
} from '../store';
import { Activity, ActivityPayload, PagedResponse } from '../types';
import { getApiErrorMessage } from '../helpers';

export const useActivitiesStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingActivities, activities, activeActivity } = useAppSelector((state) => state.activities);

    const startLoadingActivities = async () => {
        try {
            const { data } = await crmApi.get<PagedResponse<Activity>>('/activities', { params: { pageSize: 100 } });
            dispatch(onSetActivities(data.items));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las tareas', 'error');
        }
    };

    const startSavingActivity = async (activityData: ActivityPayload): Promise<boolean> => {
        try {
            if (activityData.id) {
                const { data } = await crmApi.put(`/activities/${activityData.id}`, activityData);
                dispatch(onUpdateActivity(data));
            } else {
                const { data } = await crmApi.post('/activities', activityData);
                dispatch(onAddActivity(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo guardar la tarea'), 'error');
            return false;
        }
    };

    const startTogglingCompleted = async (activity: Activity) => {
        try {
            const { data } = await crmApi.put(`/activities/${activity.id}`, {
                ...activity,
                status: activity.status === 'Completed' ? 'Pending' : 'Completed',
            });
            dispatch(onUpdateActivity(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la tarea', 'error');
        }
    };

    const startDeletingActivity = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/activities/${id}`);
            dispatch(onDeleteActivity(id));
        } catch (error: any) {
            Swal.fire('Error', getApiErrorMessage(error, 'No se pudo eliminar la tarea'), 'error');
        }
    };

    const setActiveActivity = (activity: Activity) => dispatch(onSetActiveActivity(activity));
    const clearActiveActivity = () => dispatch(onClearActiveActivity());

    return {
        isLoadingActivities,
        activities,
        activeActivity,

        startLoadingActivities,
        startSavingActivity,
        startTogglingCompleted,
        startDeletingActivity,
        setActiveActivity,
        clearActiveActivity,
    };
};
