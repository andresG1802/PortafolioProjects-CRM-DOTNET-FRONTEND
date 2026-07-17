import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useCustomersStore, useUiStore } from '../../hooks';
import { AppModal as Modal } from '../../shared/AppModal';

interface CustomerForm {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
}

const initialForm: CustomerForm = {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
};

export const CustomerModal = () => {
    const { isCustomerModalOpen, closeCustomerModal } = useUiStore();
    const { activeCustomer, startSavingCustomer, clearActiveCustomer } = useCustomersStore();

    const [formValues, setFormValues] = useState<CustomerForm>(initialForm);

    useEffect(() => {
        setFormValues(
            activeCustomer
                ? {
                      name: activeCustomer.name,
                      company: activeCustomer.company || '',
                      email: activeCustomer.email || '',
                      phone: activeCustomer.phone || '',
                      address: activeCustomer.address || '',
                  }
                : initialForm,
        );
    }, [activeCustomer, isCustomerModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeCustomerModal();
        clearActiveCustomer();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingCustomer({ ...formValues, id: activeCustomer?.id });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isCustomerModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeCustomer?.id ? 'Editar cliente' : 'Nuevo cliente'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                        className="form-control"
                        name="name"
                        value={formValues.name}
                        onChange={onInputChanged}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Empresa</label>
                    <input className="form-control" name="company" value={formValues.company || ''} onChange={onInputChanged} />
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
                    <label className="form-label">Dirección</label>
                    <input className="form-control" name="address" value={formValues.address || ''} onChange={onInputChanged} />
                </div>

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
