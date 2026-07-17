import { useAuthStore } from '../../hooks';
import { getInitials } from '../../helpers';

export const Navbar = () => {
    const { user, startLogout } = useAuthStore();
    const fullName = 'fullName' in user ? user.fullName : '';

    return (
        <div className="flex items-center justify-between border-b border-app-border bg-white px-7 py-3.5">
            <div className="flex items-center gap-2.5">
                <span className="avatar-chip h-[34px] w-[34px]">{getInitials(fullName)}</span>
                <div>
                    <div className="font-semibold leading-tight">{fullName}</div>
                    <div className="text-[0.78rem] text-app-muted">Bienvenido de nuevo</div>
                </div>
            </div>

            <button className="btn-outline-danger btn-sm" onClick={startLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Salir</span>
            </button>
        </div>
    );
};
