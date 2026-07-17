import { useEffect, useMemo, useState } from 'react';

import { useCustomersStore, useDealsStore, useUiStore } from '../../hooks';
import { formatCurrency, formatDate, DEAL_STAGES } from '../../helpers';
import { DealStage, Deal } from '../../types';
import { DealModal } from '../components/DealModal';

const STAGE_BADGE: Record<DealStage, string> = {
    Prospecting: 'badge-secondary',
    Proposal: 'badge-warning',
    Negotiation: 'badge-primary',
    Won: 'badge-success',
    Lost: 'badge-danger',
};

export const DealsPage = () => {
    const { openDealModal } = useUiStore();
    const {
        deals,
        isLoadingDeals,
        startLoadingDeals,
        setActiveDeal,
        clearActiveDeal,
        startDeletingDeal,
    } = useDealsStore();
    const { customers, startLoadingCustomers } = useCustomersStore();

    const [stageFilter, setStageFilter] = useState<DealStage | ''>('');

    useEffect(() => {
        startLoadingDeals();
        startLoadingCustomers();
    }, []);

    const customerName = (customerId: string) => customers.find((customer) => customer.id === customerId)?.name || '—';

    const filteredDeals = useMemo(() => {
        if (!stageFilter) return deals;
        return deals.filter((deal) => deal.stage === stageFilter);
    }, [deals, stageFilter]);

    const onNewDeal = () => {
        clearActiveDeal();
        openDealModal();
    };

    const onEditDeal = (deal: Deal) => {
        setActiveDeal(deal);
        openDealModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Oportunidades</h3>
                    <span className="text-sm text-app-muted">{filteredDeals.length} en el pipeline</span>
                </div>
                <button className="btn-primary" onClick={onNewDeal}>
                    <i className="fas fa-plus"></i> Nueva oportunidad
                </button>
            </div>

            <div className="mb-4">
                <select
                    className="form-select w-auto"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value as DealStage | '')}
                >
                    <option value="">Todas las etapas</option>
                    {DEAL_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                            {stage}
                        </option>
                    ))}
                </select>
            </div>

            {isLoadingDeals ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-surface">
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Etapa</th>
                                <th>Cierre estimado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeals.map((deal) => (
                                <tr key={deal.id}>
                                    <td className="font-semibold">{deal.title}</td>
                                    <td>{customerName(deal.customerId)}</td>
                                    <td>{formatCurrency(deal.value)}</td>
                                    <td>
                                        <span className={STAGE_BADGE[deal.stage]}>
                                            {deal.stage}
                                        </span>
                                    </td>
                                    <td>{formatDate(deal.expectedCloseDate)}</td>
                                    <td className="text-right">
                                        <button
                                            className="btn-outline-primary btn-sm mr-2"
                                            onClick={() => onEditDeal(deal)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-outline-danger btn-sm"
                                            onClick={() => startDeletingDeal(deal.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredDeals.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <i className="fas fa-chart-line"></i>
                                            No hay oportunidades para mostrar.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <DealModal />
        </div>
    );
};
