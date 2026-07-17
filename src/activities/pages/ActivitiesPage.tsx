import { useEffect, useMemo, useState } from 'react';

import { useActivitiesStore, useCustomersStore, useUiStore } from '../../hooks';
import { formatDateTime } from '../../helpers';
import { Activity, ActivityType } from '../../types';
import { ActivityModal } from '../components/ActivityModal';

const TYPE_BADGE: Record<ActivityType, string> = {
    Call: 'badge-info',
    Meeting: 'badge-primary',
    Email: 'badge-secondary',
    Task: 'badge-dark',
};

type Filter = 'pending' | 'completed' | 'all';

export const ActivitiesPage = () => {
    const { openActivityModal } = useUiStore();
    const {
        activities,
        isLoadingActivities,
        startLoadingActivities,
        setActiveActivity,
        clearActiveActivity,
        startTogglingCompleted,
        startDeletingActivity,
    } = useActivitiesStore();
    const { customers, startLoadingCustomers } = useCustomersStore();

    const [filter, setFilter] = useState<Filter>('pending');

    useEffect(() => {
        startLoadingActivities();
        startLoadingCustomers();
    }, []);

    const customerName = (customerId?: string | null) => customers.find((customer) => customer.id === customerId)?.name;

    const filteredActivities = useMemo(() => {
        if (filter === 'pending') return activities.filter((activity) => activity.status === 'Pending');
        if (filter === 'completed') return activities.filter((activity) => activity.status === 'Completed');
        return activities;
    }, [activities, filter]);

    const onNewActivity = () => {
        clearActiveActivity();
        openActivityModal();
    };

    const onEditActivity = (activity: Activity) => {
        setActiveActivity(activity);
        openActivityModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Tareas</h3>
                    <span className="text-sm text-app-muted">{filteredActivities.length} tarea{filteredActivities.length === 1 ? '' : 's'}</span>
                </div>
                <button className="btn-primary" onClick={onNewActivity}>
                    <i className="fas fa-plus"></i> Nueva tarea
                </button>
            </div>

            <div className="segmented mb-4">
                <button
                    className={`segmented-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pendientes
                </button>
                <button
                    className={`segmented-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completadas
                </button>
                <button
                    className={`segmented-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todas
                </button>
            </div>

            {isLoadingActivities ? (
                <p>Cargando...</p>
            ) : (
                <ul className="list-group">
                    {filteredActivities.map((activity) => (
                        <li key={activity.id} className="list-group-item">
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded accent-primary"
                                    checked={activity.status === 'Completed'}
                                    onChange={() => startTogglingCompleted(activity)}
                                />
                                <div>
                                    <span className={activity.status === 'Completed' ? 'text-app-muted line-through' : ''}>
                                        {activity.title}
                                    </span>{' '}
                                    <span className={TYPE_BADGE[activity.type]}>{activity.type}</span>
                                    <div className="text-sm text-app-muted">
                                        Vence {formatDateTime(activity.dueDate)}
                                        {activity.customerId && ` · ${customerName(activity.customerId)}`}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="btn-outline-primary btn-sm mr-1" onClick={() => onEditActivity(activity)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-outline-danger btn-sm" onClick={() => startDeletingActivity(activity.id)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </li>
                    ))}

                    {filteredActivities.length === 0 && (
                        <li>
                            <div className="empty-state py-2">
                                <i className="fas fa-check-square"></i>
                                No hay tareas para mostrar.
                            </div>
                        </li>
                    )}
                </ul>
            )}

            <ActivityModal />
        </div>
    );
};
