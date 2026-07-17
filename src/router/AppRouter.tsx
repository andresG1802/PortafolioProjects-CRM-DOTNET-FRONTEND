import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuthStore } from '../hooks';
import { LoginPage } from '../auth';
import { DashboardLayout } from '../layout';
import { DashboardPage } from '../dashboard';
import { CustomersPage, CustomerDetailPage } from '../customers';
import { LeadsPage } from '../leads';
import { DealsPage } from '../deals';
import { ActivitiesPage } from '../activities';

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    if (status === 'checking') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" role="status" />
            </div>
        );
    }

    return (
        <Routes>
            {status === 'not-authenticated' ? (
                <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="customers/:id" element={<CustomerDetailPage />} />
                        <Route path="leads" element={<LeadsPage />} />
                        <Route path="deals" element={<DealsPage />} />
                        <Route path="activities" element={<ActivitiesPage />} />
                    </Route>
                    <Route path="/*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};
