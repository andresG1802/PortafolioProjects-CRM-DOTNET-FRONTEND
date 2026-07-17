import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useActivitiesStore, useCustomersStore, useDealsStore, useUiStore } from '../../hooks';
import { formatCurrency, formatDate, formatDateTime, getInitials } from '../../helpers';
import { Contact, DealStage, Deal, Activity, ActivityStatus } from '../../types';
import { CustomerModal } from '../components/CustomerModal';
import { ContactModal } from '../components/ContactModal';
import { DealModal } from '../../deals';
import { ActivityModal } from '../../activities';

const STAGE_BADGE: Record<DealStage, string> = {
    Prospecting: 'badge-secondary',
    Proposal: 'badge-warning',
    Negotiation: 'badge-primary',
    Won: 'badge-success',
    Lost: 'badge-danger',
};

const ACTIVITY_STATUS_BADGE: Record<ActivityStatus, string> = {
    Pending: 'badge-secondary',
    Completed: 'badge-success',
    Cancelled: 'badge-danger',
};

export const CustomerDetailPage = () => {
    const { id = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        activeCustomer,
        contacts,
        notes,
        startLoadingCustomerDetail,
        clearActiveCustomer,
        setActiveCustomer,
        startDeletingContact,
        startSavingNote,
        startDeletingNote,
    } = useCustomersStore();

    const { deals, startLoadingDeals, setActiveDeal, clearActiveDeal } = useDealsStore();
    const { activities, startLoadingActivities, setActiveActivity, clearActiveActivity, startTogglingCompleted } = useActivitiesStore();
    const { openCustomerModal, openContactModal, openDealModal, openActivityModal } = useUiStore();

    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        startLoadingCustomerDetail(id);
        startLoadingDeals();
        startLoadingActivities();

        return () => { clearActiveCustomer(); };
    }, [id]);

    const dealsForCustomer = useMemo(
        () => deals.filter((deal) => deal.customerId === id),
        [deals, id],
    );

    const activitiesForCustomer = useMemo(
        () => activities.filter((activity) => activity.customerId === id),
        [activities, id],
    );

    if (!activeCustomer) {
        return <p>Cargando...</p>;
    }

    const onEditCustomer = () => {
        setActiveCustomer(activeCustomer);
        openCustomerModal();
    };

    const onNewContact = () => {
        setEditingContact(null);
        openContactModal();
    };

    const onEditContact = (contact: Contact) => {
        setEditingContact(contact);
        openContactModal();
    };

    const onNewDeal = () => {
        clearActiveDeal();
        openDealModal();
    };

    const onEditDeal = (deal: Deal) => {
        setActiveDeal(deal);
        openDealModal();
    };

    const onNewActivity = () => {
        clearActiveActivity();
        openActivityModal();
    };

    const onEditActivity = (activity: Activity) => {
        setActiveActivity(activity);
        openActivityModal();
    };

    const onSubmitNote = async (event: FormEvent) => {
        event.preventDefault();
        if (!noteText.trim()) return;

        await startSavingNote(noteText.trim());
        setNoteText('');
    };

    return (
        <div>
            <button className="btn-link mb-2 pl-0" onClick={() => navigate('/customers')}>
                <i className="fas fa-arrow-left"></i> Volver a clientes
            </button>

            <div className="card-surface mb-6 p-5">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <span className="avatar-chip h-[52px] w-[52px] text-[1.1rem]">
                            {getInitials(activeCustomer.name)}
                        </span>
                        <div>
                            <h3 className="mb-1 text-xl">{activeCustomer.name}</h3>
                            {activeCustomer.company && <p className="mb-1 text-app-muted">{activeCustomer.company}</p>}
                            <p className="mb-1"><i className="fas fa-envelope mr-2"></i>{activeCustomer.email || '—'}</p>
                            <p className="mb-1"><i className="fas fa-phone mr-2"></i>{activeCustomer.phone || '—'}</p>
                            <p className="mb-1"><i className="fas fa-map-marker-alt mr-2"></i>{activeCustomer.address || '—'}</p>
                        </div>
                    </div>
                    <button className="btn-outline-primary" onClick={onEditCustomer}>
                        <i className="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h5 className="m-0 text-lg">Contactos</h5>
                        <button className="btn-primary btn-sm" onClick={onNewContact}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <ul className="list-group">
                        {contacts.map((contact) => (
                            <li key={contact.id} className="list-group-item">
                                <div>
                                    <strong>{contact.firstName} {contact.lastName}</strong>
                                    {contact.position && <span className="text-app-muted"> — {contact.position}</span>}
                                    <div className="text-sm text-app-muted">{contact.email} {contact.phone}</div>
                                </div>
                                <div>
                                    <button className="btn-outline-primary btn-sm mr-1" onClick={() => onEditContact(contact)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn-outline-danger btn-sm"
                                        onClick={() => startDeletingContact(contact.id)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                        {contacts.length === 0 && (
                            <li>
                                <div className="empty-state py-2">
                                    <i className="fas fa-address-book"></i>
                                    Sin contactos
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h5 className="m-0 text-lg">Oportunidades</h5>
                        <button className="btn-primary btn-sm" onClick={onNewDeal}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <ul className="list-group">
                        {dealsForCustomer.map((deal) => (
                            <li key={deal.id} className="list-group-item">
                                <div>
                                    <strong>{deal.title}</strong>{' '}
                                    <span className={STAGE_BADGE[deal.stage]}>{deal.stage}</span>
                                    <div className="text-sm text-app-muted">
                                        {formatCurrency(deal.value)} · cierre {formatDate(deal.expectedCloseDate)}
                                    </div>
                                </div>
                                <button className="btn-outline-primary btn-sm" onClick={() => onEditDeal(deal)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                            </li>
                        ))}
                        {dealsForCustomer.length === 0 && (
                            <li>
                                <div className="empty-state py-2">
                                    <i className="fas fa-chart-line"></i>
                                    Sin oportunidades
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <h5 className="m-0 text-lg">Tareas</h5>
                    <button className="btn-primary btn-sm" onClick={onNewActivity}>
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                <ul className="list-group">
                    {activitiesForCustomer.map((activity) => (
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
                                    <span className={ACTIVITY_STATUS_BADGE[activity.status]}>{activity.status}</span>
                                    <div className="text-sm text-app-muted">Vence {formatDateTime(activity.dueDate)}</div>
                                </div>
                            </div>
                            <button className="btn-outline-primary btn-sm" onClick={() => onEditActivity(activity)}>
                                <i className="fas fa-edit"></i>
                            </button>
                        </li>
                    ))}
                    {activitiesForCustomer.length === 0 && (
                        <li>
                            <div className="empty-state py-2">
                                <i className="fas fa-check-square"></i>
                                Sin tareas
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            <div className="mt-6">
                <h5 className="mb-2 text-lg">Notas</h5>
                <form onSubmit={onSubmitNote} className="mb-2 flex gap-2">
                    <input
                        className="form-control"
                        placeholder="Escribe una nota..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">Agregar</button>
                </form>
                <ul className="list-group">
                    {notes.map((note) => (
                        <li key={note.id} className="list-group-item items-start">
                            <div>
                                <div>{note.content}</div>
                                <div className="text-sm text-app-muted">{formatDateTime(note.createdAt)}</div>
                            </div>
                            <button className="btn-outline-danger btn-sm" onClick={() => startDeletingNote(note.id)}>
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </li>
                    ))}
                    {notes.length === 0 && (
                        <li>
                            <div className="empty-state py-2">
                                <i className="fas fa-sticky-note"></i>
                                Sin notas
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            <CustomerModal />
            <ContactModal activeContact={editingContact} onAfterClose={() => setEditingContact(null)} />
            <DealModal lockedCustomerId={id} />
            <ActivityModal lockedCustomerId={id} />
        </div>
    );
};
