import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../';

export const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />
                <div className="flex-1 overflow-y-auto bg-app-bg p-7">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
