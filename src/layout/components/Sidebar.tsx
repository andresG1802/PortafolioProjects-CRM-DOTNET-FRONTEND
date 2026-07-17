import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
    return (
        <div className="flex w-60 flex-shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-[#201c45] to-[#14122c] p-3">
            <div className="mb-4 flex items-center gap-2.5 px-1">
                <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-accent text-white shadow-[0_6px_14px_-4px_rgba(99,102,241,0.6)]">
                    <i className="fas fa-briefcase"></i>
                </span>
                <span className="text-[1.05rem] font-extrabold tracking-tight text-white">CRM</span>
            </div>

            <span className="mb-1.5 mt-2 px-3 text-[0.68rem] font-bold uppercase tracking-widest text-white/35">Principal</span>
            <nav className="flex flex-col gap-1">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-gauge-high mr-2"></i> Dashboard
                </NavLink>
                <NavLink to="/customers" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-users mr-2"></i> Clientes
                </NavLink>
                <NavLink to="/leads" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-bullseye mr-2"></i> Leads
                </NavLink>
                <NavLink to="/deals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-chart-line mr-2"></i> Oportunidades
                </NavLink>
                <NavLink to="/activities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-check-square mr-2"></i> Tareas
                </NavLink>
            </nav>
        </div>
    );
};
