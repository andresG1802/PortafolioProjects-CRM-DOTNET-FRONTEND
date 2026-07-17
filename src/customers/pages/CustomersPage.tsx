import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCustomersStore, useUiStore } from '../../hooks';
import { getInitials } from '../../helpers';
import { Customer } from '../../types';
import { CustomerModal } from '../components/CustomerModal';

export const CustomersPage = () => {
    const navigate = useNavigate();
    const { openCustomerModal } = useUiStore();
    const {
        customers,
        isLoadingCustomers,
        startLoadingCustomers,
        setActiveCustomer,
        clearActiveCustomer,
        startDeletingCustomer,
    } = useCustomersStore();

    const [search, setSearch] = useState('');

    useEffect(() => {
        startLoadingCustomers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => startLoadingCustomers(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const onNewCustomer = () => {
        clearActiveCustomer();
        openCustomerModal();
    };

    const onEditCustomer = (customer: Customer) => {
        setActiveCustomer(customer);
        openCustomerModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Clientes</h3>
                    <span className="text-sm text-app-muted">{customers.length} cliente{customers.length === 1 ? '' : 's'} registrados</span>
                </div>
                <button className="btn-primary" onClick={onNewCustomer}>
                    <i className="fas fa-plus"></i> Nuevo cliente
                </button>
            </div>

            <div className="mb-4">
                <input
                    className="form-control max-w-xs"
                    placeholder="Buscar por nombre o empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoadingCustomers ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-surface">
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Empresa</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="cursor-pointer">
                                    <td onClick={() => navigate(`/customers/${customer.id}`)}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="avatar-chip">{getInitials(customer.name)}</span>
                                            <span className="font-semibold">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td onClick={() => navigate(`/customers/${customer.id}`)}>{customer.company}</td>
                                    <td onClick={() => navigate(`/customers/${customer.id}`)}>{customer.email}</td>
                                    <td onClick={() => navigate(`/customers/${customer.id}`)}>{customer.phone}</td>
                                    <td className="text-right">
                                        <button className="btn-outline-primary btn-sm mr-2" onClick={() => onEditCustomer(customer)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-outline-danger btn-sm"
                                            onClick={() => startDeletingCustomer(customer.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <i className="fas fa-users"></i>
                                            No hay clientes registrados todavía.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <CustomerModal />
        </div>
    );
};
