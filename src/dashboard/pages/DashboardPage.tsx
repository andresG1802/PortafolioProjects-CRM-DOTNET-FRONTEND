import { useEffect } from 'react';

import { useDashboardStore } from '../../hooks';
import { formatCurrency } from '../../helpers';

const STAT_ICON: Record<string, string> = {
    customers: 'fa-users',
    leads: 'fa-bullseye',
    deals: 'fa-chart-line',
    activities: 'fa-check-square',
};

export const DashboardPage = () => {
    const { summary, isLoadingSummary, startLoadingSummary } = useDashboardStore();

    useEffect(() => {
        startLoadingSummary();
    }, []);

    if (isLoadingSummary || !summary) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="m-0 text-2xl">Dashboard</h3>
                <span className="text-sm text-app-muted">Resumen general de tu pipeline de ventas</span>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card-surface flex items-center gap-3.5 p-5">
                    <span className="avatar-chip h-11 w-11">
                        <i className={`fas ${STAT_ICON.customers}`}></i>
                    </span>
                    <div>
                        <div className="text-2xl font-extrabold leading-tight">{summary.totalCustomers}</div>
                        <div className="text-sm text-app-muted">Clientes ({summary.totalContacts} contactos)</div>
                    </div>
                </div>

                <div className="card-surface flex items-center gap-3.5 p-5">
                    <span className="avatar-chip h-11 w-11">
                        <i className={`fas ${STAT_ICON.leads}`}></i>
                    </span>
                    <div>
                        <div className="text-2xl font-extrabold leading-tight">{summary.totalLeads}</div>
                        <div className="text-sm text-app-muted">Leads</div>
                    </div>
                </div>

                <div className="card-surface flex items-center gap-3.5 p-5">
                    <span className="avatar-chip h-11 w-11">
                        <i className={`fas ${STAT_ICON.deals}`}></i>
                    </span>
                    <div>
                        <div className="text-2xl font-extrabold leading-tight">{formatCurrency(summary.openDealsValue)}</div>
                        <div className="text-sm text-app-muted">En oportunidades abiertas ({summary.totalDeals})</div>
                    </div>
                </div>

                <div className="card-surface flex items-center gap-3.5 p-5">
                    <span className="avatar-chip h-11 w-11">
                        <i className={`fas ${STAT_ICON.activities}`}></i>
                    </span>
                    <div>
                        <div className="text-2xl font-extrabold leading-tight">{summary.pendingActivities}</div>
                        <div className="text-sm text-app-muted">Tareas pendientes ({summary.overdueActivities} vencidas)</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="card-surface p-5">
                    <h5 className="mb-3 text-lg">Leads por estado</h5>
                    <ul className="flex flex-col gap-2">
                        {Object.entries(summary.leadsByStatus).map(([status, count]) => (
                            <li key={status} className="flex items-center justify-between text-sm">
                                <span className="text-app-muted">{status}</span>
                                <span className="badge-secondary">{count}</span>
                            </li>
                        ))}
                        {Object.keys(summary.leadsByStatus).length === 0 && (
                            <li className="text-sm text-app-muted">Sin leads todavía.</li>
                        )}
                    </ul>
                </div>

                <div className="card-surface p-5">
                    <h5 className="mb-3 text-lg">Oportunidades por etapa</h5>
                    <ul className="flex flex-col gap-2">
                        {Object.entries(summary.dealsByStage).map(([stage, count]) => (
                            <li key={stage} className="flex items-center justify-between text-sm">
                                <span className="text-app-muted">{stage}</span>
                                <span className="badge-secondary">{count}</span>
                            </li>
                        ))}
                        {Object.keys(summary.dealsByStage).length === 0 && (
                            <li className="text-sm text-app-muted">Sin oportunidades todavía.</li>
                        )}
                    </ul>
                    <div className="mt-4 border-t border-app-border pt-3 text-sm text-app-muted">
                        Ganado: <span className="font-semibold text-app-text">{formatCurrency(summary.wonDealsValue)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
