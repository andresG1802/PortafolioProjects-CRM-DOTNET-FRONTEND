import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useCustomersStore, useDealsStore, useUiStore } from '../../hooks';
import { DEAL_STAGES, toDateInputValue } from '../../helpers';
import { DealStage } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface DealForm {
    title: string;
    value: string;
    stage: DealStage;
    customerId: string;
    expectedCloseDate: string;
}

const initialForm: DealForm = {
    title: '',
    value: '',
    stage: 'Prospecting',
    customerId: '',
    expectedCloseDate: '',
};

interface Props {
    lockedCustomerId?: string;
}

export const DealModal = ({ lockedCustomerId }: Props) => {
    const { isDealModalOpen, closeDealModal } = useUiStore();
    const { activeDeal, startSavingDeal, clearActiveDeal } = useDealsStore();
    const { customers } = useCustomersStore();

    const [formValues, setFormValues] = useState<DealForm>(initialForm);

    useEffect(() => {
        if (activeDeal) {
            setFormValues({
                title: activeDeal.title,
                value: String(activeDeal.value),
                stage: activeDeal.stage,
                customerId: activeDeal.customerId,
                expectedCloseDate: toDateInputValue(activeDeal.expectedCloseDate),
            });
        } else {
            setFormValues({ ...initialForm, customerId: lockedCustomerId || '' });
        }
    }, [activeDeal, isDealModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeDealModal();
        clearActiveDeal();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingDeal({
            ...formValues,
            id: activeDeal?.id,
            value: Number(formValues.value),
            expectedCloseDate: formValues.expectedCloseDate || undefined,
        });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isDealModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeDeal?.id ? 'Editar oportunidad' : 'Nueva oportunidad'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Cliente</label>
                    <select
                        className="form-select"
                        name="customerId"
                        value={formValues.customerId}
                        onChange={onInputChanged}
                        disabled={!!activeDeal?.id}
                        required
                    >
                        <option value="" disabled>Selecciona un cliente</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">Título</label>
                    <input className="form-control" name="title" value={formValues.title} onChange={onInputChanged} required />
                </div>

                <div className="mb-2 grid grid-cols-2 gap-3">
                    <div>
                        <label className="form-label">Monto</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="value"
                            value={formValues.value}
                            onChange={onInputChanged}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Etapa</label>
                        <select className="form-select" name="stage" value={formValues.stage} onChange={onInputChanged}>
                            {DEAL_STAGES.map((stage) => (
                                <option key={stage} value={stage}>
                                    {stage}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Fecha de cierre estimada</label>
                    <input
                        type="date"
                        className="form-control"
                        name="expectedCloseDate"
                        value={formValues.expectedCloseDate?.slice(0, 10) || ''}
                        onChange={onInputChanged}
                    />
                </div>

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
