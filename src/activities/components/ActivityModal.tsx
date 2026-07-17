import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useActivitiesStore, useCustomersStore, useDealsStore, useLeadsStore, useUiStore } from '../../hooks';
import { ACTIVITY_TYPES, toDateInputValue } from '../../helpers';
import { ActivityStatus, ActivityType } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface ActivityForm {
    title: string;
    description: string;
    type: ActivityType;
    status: ActivityStatus;
    dueDate: string;
    customerId: string;
    leadId: string;
    dealId: string;
}

const initialForm: ActivityForm = {
    title: '',
    description: '',
    type: 'Task',
    status: 'Pending',
    dueDate: '',
    customerId: '',
    leadId: '',
    dealId: '',
};

interface Props {
    lockedCustomerId?: string;
    lockedLeadId?: string;
    lockedDealId?: string;
}

export const ActivityModal = ({ lockedCustomerId, lockedLeadId, lockedDealId }: Props) => {
    const { isActivityModalOpen, closeActivityModal } = useUiStore();
    const { activeActivity, startSavingActivity, clearActiveActivity } = useActivitiesStore();
    const { customers } = useCustomersStore();
    const { leads } = useLeadsStore();
    const { deals } = useDealsStore();

    const [formValues, setFormValues] = useState<ActivityForm>(initialForm);

    useEffect(() => {
        if (activeActivity) {
            setFormValues({
                title: activeActivity.title,
                description: activeActivity.description || '',
                type: activeActivity.type,
                status: activeActivity.status,
                dueDate: toDateInputValue(activeActivity.dueDate),
                customerId: activeActivity.customerId || '',
                leadId: activeActivity.leadId || '',
                dealId: activeActivity.dealId || '',
            });
        } else {
            setFormValues({
                ...initialForm,
                customerId: lockedCustomerId || '',
                leadId: lockedLeadId || '',
                dealId: lockedDealId || '',
            });
        }
    }, [activeActivity, isActivityModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeActivityModal();
        clearActiveActivity();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingActivity({
            ...formValues,
            id: activeActivity?.id,
            customerId: formValues.customerId || undefined,
            leadId: formValues.leadId || undefined,
            dealId: formValues.dealId || undefined,
        });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isActivityModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeActivity?.id ? 'Editar tarea' : 'Nueva tarea'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Título</label>
                    <input className="form-control" name="title" value={formValues.title} onChange={onInputChanged} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows={2}
                        value={formValues.description || ''}
                        onChange={onInputChanged}
                    ></textarea>
                </div>

                <div className="mb-2 grid grid-cols-2 gap-3">
                    <div>
                        <label className="form-label">Tipo</label>
                        <select className="form-select" name="type" value={formValues.type} onChange={onInputChanged}>
                            {ACTIVITY_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Vencimiento</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            name="dueDate"
                            value={formValues.dueDate}
                            onChange={onInputChanged}
                        />
                    </div>
                </div>

                {activeActivity?.id && (
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="status" value={formValues.status} onChange={onInputChanged}>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                )}

                <div className="mb-2">
                    <label className="form-label">Cliente (opcional)</label>
                    <select className="form-select" name="customerId" value={formValues.customerId} onChange={onInputChanged}>
                        <option value="">Sin cliente</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">Lead (opcional)</label>
                    <select className="form-select" name="leadId" value={formValues.leadId} onChange={onInputChanged}>
                        <option value="">Sin lead</option>
                        {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">Oportunidad (opcional)</label>
                    <select className="form-select" name="dealId" value={formValues.dealId} onChange={onInputChanged}>
                        <option value="">Sin oportunidad</option>
                        {deals.map((deal) => (
                            <option key={deal.id} value={deal.id}>{deal.title}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
