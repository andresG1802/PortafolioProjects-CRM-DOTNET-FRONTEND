import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useLeadsStore, useUiStore } from '../../hooks';
import { LEAD_STATUSES } from '../../helpers';
import { LeadStatus } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface LeadForm {
    name: string;
    email: string;
    phone: string;
    source: string;
    status: LeadStatus;
}

const initialForm: LeadForm = { name: '', email: '', phone: '', source: '', status: 'New' };

export const LeadModal = () => {
    const { isLeadModalOpen, closeLeadModal } = useUiStore();
    const { activeLead, startSavingLead, clearActiveLead } = useLeadsStore();

    const [formValues, setFormValues] = useState<LeadForm>(initialForm);

    useEffect(() => {
        setFormValues(
            activeLead
                ? {
                      name: activeLead.name,
                      email: activeLead.email || '',
                      phone: activeLead.phone || '',
                      source: activeLead.source || '',
                      status: activeLead.status,
                  }
                : initialForm,
        );
    }, [activeLead, isLeadModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeLeadModal();
        clearActiveLead();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingLead({ ...formValues, id: activeLead?.id });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isLeadModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeLead?.id ? 'Editar lead' : 'Nuevo lead'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" name="name" value={formValues.name} onChange={onInputChanged} required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formValues.email || ''}
                        onChange={onInputChanged}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" name="phone" value={formValues.phone || ''} onChange={onInputChanged} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Origen</label>
                    <input className="form-control" name="source" value={formValues.source || ''} onChange={onInputChanged} placeholder="Sitio web, referido, etc." />
                </div>

                {activeLead?.id && (
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="status" value={formValues.status} onChange={onInputChanged}>
                            {LEAD_STATUSES.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
