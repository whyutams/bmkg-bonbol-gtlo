import React, { useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    Building2
} from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillCredentials = (email: string) => {
        setData({
            ...data,
            email: email,
            password: 'password123'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#001d4a] via-[#002b66] to-[#003580] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-slate-100 relative overflow-hidden">
            <Head title="Masuk Portal Administrasi - BMKG Bone Bolango" />

            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 backdrop-blur-xs transition-colors border border-white/15"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Portal Publik</span>
                </Link>
            </header>

            <main className="relative z-10 w-full max-w-md mx-auto my-8">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
                    <div className="h-2 bg-gradient-to-r from-bmkg-primary via-bmkg-accent to-sky-400"></div>

                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="text-center space-y-3">
                            <div className="inline-flex p-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs mb-1">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/e/e3/BMG_2003.png"
                                    alt="Logo BMKG"
                                    className="w-12 h-12 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-bmkg-primary text-[10px] font-extrabold uppercase tracking-wider mb-1">
                                    Portal Administrasi UPT
                                </span>
                                <h1 className="text-lg sm:text-xl font-black text-bmkg-navy tracking-tight">
                                    Staklim Bone Bolango
                                </h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    Badan Meteorologi, Klimatologi, dan Geofisika
                                </p>
                            </div>
                        </div>

                        {status && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{status}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan email anda"
                                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{errors.email}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Password Akun
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan password"
                                        className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-bmkg-primary border-slate-300 rounded focus:ring-bmkg-primary"
                                    />
                                    <span className="text-xs text-slate-600 font-medium">Ingat saya pada perangkat ini</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-bmkg-primary to-bmkg-dark hover:brightness-90 text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                            >
                                <span>{processing ? 'Memproses ...' : 'Login'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 max-w-7xl mx-auto w-full text-center text-[11px] text-white/50">
                <div>
                    © {new Date().getFullYear()} <strong className="text-slate-300">Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</strong>. Hak Cipta Dilindungi.
                </div>
            </footer>
        </div>
    );
}
