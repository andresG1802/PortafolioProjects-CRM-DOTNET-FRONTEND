import { useEffect, useMemo, useState } from 'react';

import { useLeadsStore, useUiStore } from '../../hooks';
import { LEAD_STATUSES } from '../../helpers';
import { Lead, LeadStatus } from '../../types';
import { LeadModal } from '../components/LeadModal';

const STATUS_BADGE: Record<LeadStatus, string> = {
    New: 'badge-secondary',
    Contacted: 'badge-info',
    Qualified: 'badge-primary',
    Lost: 'badge-danger',
    Converted: 'badge-success',
};

export const LeadsPage = () => {
    const { openLeadModal } = useUiStore();
    const {
        leads,
        isLoadingLeads,
        startLoadingLeads,
        setActiveLead,
        clearActiveLead,
        startDeletingLead,
    } = useLeadsStore();

    const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');

    useEffect(() => {
        startLoadingLeads();
    }, []);

    const filteredLeads = useMemo(() => {
        if (!statusFilter) return leads;
        return leads.filter((lead) => lead.status === statusFilter);
    }, [leads, statusFilter]);

    const onNewLead = () => {
        clearActiveLead();
        openLeadModal();
    };

    const onEditLead = (lead: Lead) => {
        setActiveLead(lead);
        openLeadModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Leads</h3>
                    <span className="text-sm text-app-muted">{filteredLeads.length} lead{filteredLeads.length === 1 ? '' : 's'}</span>
                </div>
                <button className="btn-primary" onClick={onNewLead}>
                    <i className="fas fa-plus"></i> Nuevo lead
                </button>
            </div>

            <div className="mb-4">
                <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
                >
                    <option value="">Todos los estados</option>
                    {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {isLoadingLeads ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-surface">
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Origen</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id}>
                                    <td className="font-semibold">{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td>{lead.source}</td>
                                    <td>
                                        <span className={STATUS_BADGE[lead.status]}>{lead.status}</span>
                                    </td>
                                    <td className="text-right">
                                        <button className="btn-outline-primary btn-sm mr-2" onClick={() => onEditLead(lead)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn-outline-danger btn-sm" onClick={() => startDeletingLead(lead.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <i className="fas fa-bullseye"></i>
                                            No hay leads para mostrar.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <LeadModal />
        </div>
    );
};
