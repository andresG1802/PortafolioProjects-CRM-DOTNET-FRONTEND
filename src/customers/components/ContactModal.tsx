import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useCustomersStore, useUiStore } from '../../hooks';
import { Contact } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface ContactForm {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
}

const initialForm: ContactForm = { firstName: '', lastName: '', position: '', email: '', phone: '' };

interface Props {
    activeContact: Contact | null;
    onAfterClose?: () => void;
}

export const ContactModal = ({ activeContact, onAfterClose }: Props) => {
    const { isContactModalOpen, closeContactModal } = useUiStore();
    const { startSavingContact } = useCustomersStore();

    const [formValues, setFormValues] = useState<ContactForm>(initialForm);

    useEffect(() => {
        setFormValues(
            activeContact
                ? {
                      firstName: activeContact.firstName,
                      lastName: activeContact.lastName,
                      position: activeContact.position || '',
                      email: activeContact.email || '',
                      phone: activeContact.phone || '',
                  }
                : initialForm,
        );
    }, [activeContact, isContactModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeContactModal();
        onAfterClose?.();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingContact({ ...formValues, id: activeContact?.id });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isContactModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeContact?.id ? 'Editar contacto' : 'Nuevo contacto'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                        className="form-control"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={onInputChanged}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Apellido</label>
                    <input
                        className="form-control"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={onInputChanged}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Cargo</label>
                    <input className="form-control" name="position" value={formValues.position || ''} onChange={onInputChanged} />
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

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
