import React, { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    AlertTriangle, 
    CloudRain, 
    FileText, 
    MapPin, 
    FileCheck, 
    Smile, 
    Users, 
    ShieldCheck, 
    ExternalLink, 
    LogOut, 
    User as UserIcon, 
    Menu, 
    X, 
    Clock, 
    ChevronRight,
    ChevronDown,
    UserCog,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface AuthenticatedProps {
    header?: ReactNode;
    title?: string;
}

export default function AuthenticatedLayout({
    header,
    title,
    children,
}: PropsWithChildren<AuthenticatedProps>) {
    const page = usePage();
    const user = page.props.auth.user as {
        id: number;
        name: string;
        email: string;
        role: 'superadmin' | 'admin' | 'staf';
        nip?: string;
        jabatan?: string;
        gender?: 'pria' | 'wanita' | 'laki-laki' | 'perempuan';
        avatar?: string;
        avatar_url?: string;
    };
    const flash = (page.props as any).flash as { success?: string; error?: string } | undefined;

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLogoutModalOpen(false);
                setSidebarOpen(false);
                setProfileDropdownOpen(false);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-dropdown-container')) {
                setProfileDropdownOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const wita = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Makassar',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now) + ' WITA';
            setCurrentTime(wita);
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, []);

    const roleBadges = {
        superadmin: { label: 'Super Admin', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        admin: { label: 'Admin', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
        staf: { label: 'Staf', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    };

    const currentBadge = roleBadges[user.role] || roleBadges.staf;

    const navItems = [
        {
            group: 'Utama',
            items: [
                { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: route().current('dashboard') },
            ]
        },
        {
            group: 'Operasional Iklim & Cuaca',
            items: [
                ...((user.role === 'superadmin' || user.role === 'admin') ? [
                    { title: 'Peringatan Dini EWS', href: '/admin/warnings', icon: AlertTriangle, current: route().current('admin.warnings.*') },
                ] : []),
                { title: 'Monitoring HTH Dasarian', href: '/admin/hth', icon: CloudRain, current: route().current('admin.hth.*') },
                { title: 'Buletin & Publikasi PDF', href: '/admin/bulletins', icon: FileText, current: route().current('admin.bulletins.*') },
                { title: 'Jaringan Pos Hujan GIS', href: '/admin/pos-hujan', icon: MapPin, current: route().current('admin.pos-hujan.*') },
            ]
        },
        {
            group: 'Layanan Publik & Akuntabilitas',
            items: [
                { title: 'Tiket Layanan PTSP', href: '/admin/ptsp', icon: FileCheck, current: route().current('admin.ptsp.*') },
                ...((user.role === 'superadmin' || user.role === 'admin') ? [
                    { title: 'Hasil Kuesioner IKM', href: '/admin/ikm', icon: Smile, current: route().current('admin.ikm.*') },
                ] : []),
            ]
        },
        ...((user.role === 'superadmin') ? [
            {
                group: 'Sistem & Keamanan',
                items: [
                    { title: 'Manajemen Pegawai', href: '/admin/users', icon: Users, current: route().current('admin.users.*') },
                    { title: 'Audit Log Aktivitas', href: '/admin/audit-logs', icon: ShieldCheck, current: route().current('admin.audit-logs.*') },
                ]
            }
        ] : [])
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            
            <div className="flex flex-1">
                
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside className={`
                    fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0f172a] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0">
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/e/e3/BMG_2003.png" 
                                    alt="Logo BMKG" 
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                                    Staklim Bone Bolango
                                </h1>
                                <span className="text-[10px] text-slate-400 block">
                                    Dashboard
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    
                    <nav className="flex-1 overflow-y-auto p-3 space-y-6">
                        {navItems.map((sec, idx) => (
                            <div key={idx} className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1 block">
                                    {sec.group}
                                </span>
                                {sec.items.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                                                ${item.current 
                                                    ? 'bg-bmkg-primary text-white font-semibold shadow-xs' 
                                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}
                                            `}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="flex-1 truncate">{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>

                    
                    <div className="p-3 border-t border-slate-800 space-y-1">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            <span>Landing Page</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setLogoutModalOpen(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                
                <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
                    
                    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
                        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                {header || (
                                    <h2 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                                        {title || 'Dashboard'}
                                    </h2>
                                )}
                            </div>

                            
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{currentTime || '00:00:00 WITA'}</span>
                                </div>

                                <div className="relative" id="profile-dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center gap-2.5 p-1.5 rounded-xl text-xs text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                                        title="Menu Profil Pegawai"
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-300 flex-shrink-0 flex items-center justify-center group-hover:ring-2 group-hover:ring-bmkg-primary/30 transition-all">
                                            <img 
                                                src={user.avatar_url || (user.gender === 'wanita' || user.gender === 'perempuan' ? '/images/avatars/avatar_wanita_1.svg' : '/images/avatars/avatar_pria_1.svg')} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="hidden md:flex flex-col text-left">
                                            <span className="font-bold text-slate-800 leading-tight">{user.name}</span>
                                            <span className="text-[10px] text-slate-500">{currentBadge.label}</span>
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180 text-bmkg-primary' : ''}`} />
                                    </button>

                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in duration-100">
                                            <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                                                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                                                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                                            </div>

                                            <div className="py-1 border-b border-slate-100">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-bmkg-primary transition-colors font-medium"
                                                >
                                                    <UserCog className="w-4 h-4 text-slate-400" />
                                                    <span>Edit Profil</span>
                                                </Link>
                                            </div>

                                            <div className="py-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileDropdownOpen(false);
                                                        setLogoutModalOpen(true);
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4 text-rose-500" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    
                    {flash?.success && (
                        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>

                    
                    <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span>© 2026 Stasiun Klimatologi BMKG Bone Bolango - Provinsi Gorontalo</span>
                        <span className="font-mono text-[11px] text-slate-400">Sistem Operasional UPT v2.0</span>
                    </footer>
                </div>
            </div>

            {logoutModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-base font-bold text-slate-800">Konfirmasi Keluar Sistem</h3>
                            <p className="text-xs text-slate-500">
                                Apakah Anda yakin ingin mengakhiri sesi administrasi Staklim BMKG Bone Bolango?
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setLogoutModalOpen(false)}
                                className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post(route('logout'))}
                                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
