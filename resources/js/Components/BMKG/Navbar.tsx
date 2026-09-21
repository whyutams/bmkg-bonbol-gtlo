import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Clock, 
    Search, 
    Menu, 
    X, 
    ChevronDown, 
    PhoneCall, 
    ShieldAlert, 
    CloudSun, 
    CloudRain, 
    Activity, 
    FileText, 
    Home, 
    Building2,
    Compass
} from 'lucide-react';

interface NavbarProps {
    currentRoute?: string;
}

export default function Navbar({ currentRoute }: NavbarProps) {
    const [currentTimeWita, setCurrentTimeWita] = useState<string>('');
    const [currentTimeWib, setCurrentTimeWib] = useState<string>('');
    const [currentDateStr, setCurrentDateStr] = useState<string>('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const witaStr = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Makassar',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now) + ' WITA';

            const wibStr = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now) + ' WIB';

            const dateStr = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Makassar',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(now);

            setCurrentTimeWita(witaStr);
            setCurrentTimeWib(wibStr);
            setCurrentDateStr(dateStr);
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setActiveDropdown(null);
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [searchOpen]);

    const navItems = [
        {
            name: 'Beranda',
            href: '/',
            icon: Home,
            hasDropdown: false,
        },
        {
            name: 'Profil',
            href: '/profil',
            icon: Building2,
            hasDropdown: true,
            dropdownItems: [
                { title: 'Profil Instansi', desc: 'Sejarah & kedudukan Staklim Bone Bolango', href: '/profil#instansi' },
                { title: 'Visi & Misi', desc: 'Arah pembangunan & komitmen BMKG', href: '/profil#visi-misi' },
                { title: 'Tugas & Fungsi', desc: 'Regulasi dan peran klimatologi daerah', href: '/profil#tugas-fungsi' },
                { title: 'Struktur & SDM', desc: 'Profil personil dan organisasi kantor', href: '/profil#sdm' },
                { title: 'Jaringan Pengamatan', desc: 'Peta sebaran pos hujan di Gorontalo', href: '/profil#pos-hujan' },
            ]
        },
        {
            name: 'Cuaca',
            href: '/cuaca',
            icon: CloudSun,
            hasDropdown: true,
            dropdownItems: [
                { title: 'Prakiraan Cuaca Kabupaten', desc: 'Prakiraan per kecamatan di Bone Bolango', href: '/cuaca#prakiraan' },
                { title: 'Citra Satelit Himawari-9', desc: 'Pengamatan awan real-time resolusi tinggi', href: '/cuaca#satelit' },
                { title: 'Radar Cuaca', desc: 'Deteksi presipitasi & awan konvektif', href: '/cuaca#radar' },
                { title: 'Peringatan Dini Cuaca', desc: 'Waspada cuaca ekstrem Bone Bolango', href: '/cuaca#peringatan' },
            ]
        },
        {
            name: 'Iklim',
            href: '/iklim',
            icon: CloudRain,
            hasDropdown: true,
            dropdownItems: [
                { title: 'Monitoring Hari Tanpa Hujan (HTH)', desc: 'Peta & data deret hari kering terkini', href: '/iklim#hth' },
                { title: 'Analisis Curah Hujan Dasarian', desc: 'Statistik 10 harian dan evaluasi normal', href: '/iklim#analisis' },
                { title: 'Prakiraan Curah Hujan', desc: 'Prediksi probabilistik sifat hujan', href: '/iklim#prediksi' },
                { title: 'Buletin & Publikasi Iklim', desc: 'Unduh dokumen analisis iklim bulanan', href: '/iklim#buletin' },
            ]
        },
        {
            name: 'Gempabumi',
            href: '/gempa',
            icon: Activity,
            hasDropdown: true,
            dropdownItems: [
                { title: 'Gempabumi Terkini (M ≥ 5.0)', desc: 'Data real-time sistem sensor BMKG TEWS', href: '/gempa#terkini' },
                { title: 'Gempabumi Dirasakan', desc: 'Informasi gempa bumi dengan skala MMI', href: '/gempa#dirasakan' },
                { title: 'Peta Guncangan (Shakemap)', desc: 'Distribusi intensitas getaran tanah', href: '/gempa#shakemap' },
                { title: 'Panduan Mitigasi Gempa', desc: 'Pedoman keselamatan sebelum, saat & sesudah', href: '/gempa#mitigasi' },
            ]
        },
        {
            name: 'Layanan Publik',
            href: '/layanan',
            icon: FileText,
            hasDropdown: true,
            dropdownItems: [
                { title: 'Maklumat Pelayanan PTSP', desc: 'Standar kepatuhan Zona Integritas Bebas Korupsi', href: '/layanan#ptsp' },
                { title: 'Form Permintaan Data', desc: 'Pengajuan data meteorologi & klimatologi', href: '/layanan#form' },
                { title: 'Tarif PNBP BMKG', desc: 'Daftar tarif resmi PP No. 47 Tahun 2018', href: '/layanan#pnbp' },
                { title: 'Layanan Tarif Rp 0 (Gratis)', desc: 'Surat keterangan bebas biaya untuk riset/akademik', href: '/layanan#gratis' },
                { title: 'Survey Kepuasan Masyarakat (IKM)', desc: 'Penilaian mutu pelayanan publik instansi', href: '/layanan#ikm' },
            ]
        }
    ];

    const quickSearchResults = [
        { title: 'Prakiraan Cuaca Bone Bolango', link: '/cuaca', category: 'Cuaca' },
        { title: 'Gempa Bumi Terkini Real-time', link: '/gempa', category: 'Geofisika' },
        { title: 'Hari Tanpa Hujan (HTH) Gorontalo', link: '/iklim', category: 'Iklim' },
        { title: 'Formulir Permintaan Data Klimatologi', link: '/layanan', category: 'Layanan' },
        { title: 'Peta Jaringan Pos Hujan', link: '/profil', category: 'Profil' },
        { title: 'Tarif Resmi PNBP BMKG', link: '/layanan', category: 'Layanan' },
    ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <header className="w-full font-sans sticky top-0 z-50 bg-white shadow-md">
            
            <div className="bg-[#0f172a] text-white text-xs border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
                    
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-slate-300">
                            {currentDateStr}
                        </span>
                    </div>

                    
                    <div className="flex items-center gap-4 ml-auto">
                        <a 
                            href="tel:196" 
                            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
                            title="Call Center Resmi BMKG"
                        >
                            <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                            <span>Call Center: <strong className="text-white">196</strong></span>
                        </a>

                        <div className="h-3 w-px bg-slate-700 hidden md:block" />

                        
                        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700 font-mono text-[11px] text-slate-200">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{currentTimeWita || '00:00:00 WITA'}</span>
                            <span className="text-slate-500 hidden lg:inline">|</span>
                            <span className="text-slate-400 hidden lg:inline">{currentTimeWib || '00:00:00 WIB'}</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="bg-white border-b border-bmkg-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    
                    <Link href="/" className="flex items-center gap-3.5 group">
                        
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center p-0.5 bg-white rounded-lg border border-bmkg-border/60 shadow-sm">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/BMG_2003.png" 
                                alt="Logo BMKG" 
                                className="w-10 h-10 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-bmkg-primary group-hover:text-bmkg-secondary transition-colors uppercase leading-snug">
                                Badan Meteorologi, Klimatologi, dan Geofisika
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold text-bmkg-navy tracking-wide">
                                Stasiun Klimatologi Bone Bolango - Gorontalo
                            </span>
                        </div>
                    </Link>

                    
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-medium transition-all shadow-xs"
                            title="Cari data, layanan, atau berita (Ctrl+K)"
                        >
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <span className="hidden md:inline">Cari Informasi...</span>
                            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[9px] font-mono bg-white border border-gray-200 rounded text-gray-400">
                                /
                            </kbd>
                        </button>

                        
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-bmkg-navy hover:bg-bmkg-surface border border-bmkg-border"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            
            <div className="hidden lg:block bg-bmkg-primary text-white shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center space-x-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = currentRoute === item.href || (item.href !== '/' && currentRoute?.startsWith(item.href));

                            return (
                                <div 
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-150 border-b-2 ${
                                            isActive 
                                                ? 'bg-bmkg-navy text-white border-bmkg-accent' 
                                                : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent'
                                        }`}
                                    >
                                        <IconComponent className="w-3.5 h-3.5 opacity-80" />
                                        <span>{item.name}</span>
                                        {item.hasDropdown && (
                                            <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                                        )}
                                    </Link>

                                    
                                    {item.hasDropdown && activeDropdown === item.name && (
                                        <div className="absolute left-0 top-full w-72 bg-white text-gray-800 shadow-2xl rounded-b-lg border-t-2 border-bmkg-accent border-x border-b border-gray-200 py-2 z-50 animate-fadeIn">
                                            {item.dropdownItems?.map((sub) => (
                                                <Link
                                                    key={sub.title}
                                                    href={sub.href}
                                                    className="block px-4 py-2.5 hover:bg-bmkg-light transition-colors group/item"
                                                >
                                                    <div className="text-xs font-bold text-bmkg-navy group-hover/item:text-bmkg-primary">
                                                        {sub.title}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                                                        {sub.desc}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </div>

            
            {mobileMenuOpen && (
                <div className="lg:hidden bg-bmkg-navy text-white border-b border-bmkg-accent px-4 py-3 space-y-2 max-h-[80vh] overflow-y-auto">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isExpanded = activeDropdown === item.name;

                        return (
                            <div key={item.name} className="border-b border-white/10 pb-2">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-sky-300"
                                    >
                                        <IconComponent className="w-4 h-4 text-sky-400" />
                                        <span>{item.name}</span>
                                    </Link>
                                    {item.hasDropdown && (
                                        <button
                                            onClick={() => setActiveDropdown(isExpanded ? null : item.name)}
                                            className="p-1 text-white/70 hover:text-white"
                                        >
                                            <ChevronDown className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}
                                </div>

                                {item.hasDropdown && isExpanded && (
                                    <div className="mt-1 pl-6 space-y-1 bg-white/5 rounded-md p-2">
                                        {item.dropdownItems?.map((sub) => (
                                            <Link
                                                key={sub.title}
                                                href={sub.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block py-1 text-xs text-white/80 hover:text-white"
                                            >
                                                <div className="font-semibold">{sub.title}</div>
                                                <div className="text-[10px] text-white/50">{sub.desc}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-2 text-center text-xs text-white/60">
                        Hotline BMKG Bone Bolango: 0811-435-068
                    </div>
                </div>
            )}

            
            {searchOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
                    onClick={() => setSearchOpen(false)}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-bmkg-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                            <Search className="w-5 h-5 text-bmkg-primary" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Cari halaman, cuaca, gempa, atau layanan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-sm outline-none border-none text-bmkg-text placeholder-gray-400 focus:ring-0"
                            />
                            <button 
                                onClick={() => setSearchOpen(false)}
                                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto p-2">
                            {quickSearchResults.length > 0 ? (
                                <div className="space-y-1">
                                    {quickSearchResults.map((res, i) => (
                                        <Link
                                            key={i}
                                            href={res.link}
                                            onClick={() => setSearchOpen(false)}
                                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-bmkg-light transition-colors group"
                                        >
                                            <span className="text-xs font-semibold text-bmkg-navy group-hover:text-bmkg-primary">
                                                {res.title}
                                            </span>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                                                {res.category}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-xs text-gray-500">
                                    Tidak ditemukan informasi yang sesuai dengan "{searchQuery}".
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Tekan <strong>ESC</strong> untuk menutup</span>
                            <span className="text-bmkg-primary font-medium">Staklim Bone Bolango</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
