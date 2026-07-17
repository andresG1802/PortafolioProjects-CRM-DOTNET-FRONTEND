import { ChangeEvent, FormEvent, useState } from 'react';
import Swal from 'sweetalert2';

import { useAuthStore } from '../../hooks';

interface LoginForm {
    email: string;
    password: string;
}

interface RegisterForm {
    fullName: string;
    email: string;
    password: string;
    password2: string;
}

const initialLoginForm: LoginForm = { email: '', password: '' };
const initialRegisterForm: RegisterForm = { fullName: '', email: '', password: '', password2: '' };

export const LoginPage = () => {
    const { startLogin, startRegister, errorMessage } = useAuthStore();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
    const [registerForm, setRegisterForm] = useState<RegisterForm>(initialRegisterForm);

    const onLoginInputChanged = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [target.name]: target.value });
    };

    const onRegisterInputChanged = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setRegisterForm({ ...registerForm, [target.name]: target.value });
    };

    const onLoginSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await startLogin(loginForm);
    };

    const onRegisterSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (registerForm.password !== registerForm.password2) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        await startRegister(registerForm);
    };

    return (
        <div className="flex min-h-screen">
            <div className="relative hidden flex-1 flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#4f46e5,#201c45_65%)] px-[4.5rem] py-16 text-white lg:flex">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl">
                    <i className="fas fa-briefcase"></i>
                </div>
                <h1 className="mb-4 text-[2.2rem] font-extrabold tracking-tight">CRM</h1>
                <p className="max-w-[420px] text-[1.02rem] leading-relaxed text-white/75">
                    Organiza tus clientes, leads y oportunidades en un solo lugar, con una vista clara de todo tu pipeline de ventas.
                </p>

                <ul className="mt-8 flex flex-col gap-3.5">
                    <li className="flex items-center gap-2.5 text-[0.95rem] text-white/90">
                        <i className="fas fa-check-circle text-indigo-300"></i> Seguimiento de clientes y contactos
                    </li>
                    <li className="flex items-center gap-2.5 text-[0.95rem] text-white/90">
                        <i className="fas fa-check-circle text-indigo-300"></i> Pipeline de oportunidades por etapa
                    </li>
                    <li className="flex items-center gap-2.5 text-[0.95rem] text-white/90">
                        <i className="fas fa-check-circle text-indigo-300"></i> Tareas y recordatorios al día
                    </li>
                </ul>
            </div>

            <div className="flex flex-1 items-center justify-center bg-app-bg p-6">
                <div className="w-full max-w-[420px] rounded-lg bg-white p-8 shadow-lg">
                    <div className="mb-7 flex rounded-sm bg-app-border p-1">
                        <button
                            type="button"
                            className={`flex-1 rounded-[9px] px-3 py-2 text-[0.88rem] font-semibold transition ${mode === 'login' ? 'bg-white text-app-text shadow-sm' : 'text-app-muted'}`}
                            onClick={() => setMode('login')}
                        >
                            Ingresar
                        </button>
                        <button
                            type="button"
                            className={`flex-1 rounded-[9px] px-3 py-2 text-[0.88rem] font-semibold transition ${mode === 'register' ? 'bg-white text-app-text shadow-sm' : 'text-app-muted'}`}
                            onClick={() => setMode('register')}
                        >
                            Crear cuenta
                        </button>
                    </div>

                    {mode === 'login' ? (
                        <form onSubmit={onLoginSubmit}>
                            <h3 className="mb-1 text-[1.35rem]">Bienvenido de nuevo</h3>
                            <p className="mb-6 text-sm text-app-muted">Ingresa tus credenciales para continuar.</p>

                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="tu@correo.com"
                                    name="email"
                                    value={loginForm.email}
                                    onChange={onLoginInputChanged}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={onLoginInputChanged}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="mb-3 rounded-sm bg-rose-100 px-3 py-2 text-sm text-rose-700">{errorMessage}</div>
                            )}
                            <button type="submit" className="btn-primary mt-2 w-full py-2.5 text-[0.95rem]">
                                Ingresar
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={onRegisterSubmit}>
                            <h3 className="mb-1 text-[1.35rem]">Crea tu cuenta</h3>
                            <p className="mb-6 text-sm text-app-muted">Empieza a organizar tu proceso de ventas.</p>

                            <div className="mb-2.5">
                                <label className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu nombre"
                                    name="fullName"
                                    value={registerForm.fullName}
                                    onChange={onRegisterInputChanged}
                                    required
                                />
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="tu@correo.com"
                                    name="email"
                                    value={registerForm.email}
                                    onChange={onRegisterInputChanged}
                                    required
                                />
                            </div>
                            <div className="mb-2.5">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    name="password"
                                    value={registerForm.password}
                                    onChange={onRegisterInputChanged}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Repite la contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    name="password2"
                                    value={registerForm.password2}
                                    onChange={onRegisterInputChanged}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="mb-3 rounded-sm bg-rose-100 px-3 py-2 text-sm text-rose-700">{errorMessage}</div>
                            )}
                            <button type="submit" className="btn-primary mt-2 w-full py-2.5 text-[0.95rem]">
                                Crear cuenta
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
