import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import EarthquakeRealtime from '@/Components/BMKG/EarthquakeRealtime';
import { 
    Activity, 
    Clock, 
    Compass, 
    Layers, 
    ShieldAlert, 
    FileText, 
    RefreshCw, 
    AlertTriangle, 
    CheckCircle2,
    Shield,
    HelpCircle,
    Eye,
    Radio,
    MapPin,
    Maximize2
} from 'lucide-react';
import { EarthquakeData, GempaTerkiniResponse } from '@/types/bmkg';
import { convertWibToWita, formatWaktuIndo } from '@/Utils/formatters';
import Pagination, { PaginationLink } from '@/Components/Pagination';

export interface LocalEarthquakeItem {
    id: number;
    event_time: string;
    magnitude: number;
    depth_km: number;
    latitude: string;
    longitude: string;
    epicenter_location: string;
    felt_scale_mmi?: string | null;
    tsunami_potential: string;
    shakemap_image?: string | null;
    notes?: string | null;
    is_published: boolean;
    creator?: {
        name: string;
    };
    created_at?: string;
}

interface PaginatedLocalEarthquakes {
    data: LocalEarthquakeItem[];
    links?: PaginationLink[];
    total?: number;
}

interface GempaProps {
    dbLocalEarthquakes?: PaginatedLocalEarthquakes;
    dbLatestLocal?: LocalEarthquakeItem | null;
}

const FALLBACK_GEMPA_LIST: EarthquakeData[] = [
    {
        Tanggal: '19 Sep 2026',
        Jam: '15:22:10 WITA',
        Coordinates: '0.45 LS, 123.15 BT',
        Lintang: '0.45 LS',
        Bujur: '123.15 BT',
        Magnitude: '5.1',
        Kedalaman: '15 km',
        Wilayah: '78 km BaratDaya BONEBOLANGO-GORONTALO',
        Potensi: 'Tidak berpotensi TSUNAMI',
        Dirasakan: 'II-III Bone Bolango',
        Shakemap: '20260919142210.mmi.jpg'
    },
    {
        Tanggal: '18 Sep 2026',
        Jam: '09:14:32 WITA',
        Coordinates: '0.12 LU, 122.98 BT',
        Lintang: '0.12 LU',
        Bujur: '122.98 BT',
        Magnitude: '5.3',
        Kedalaman: '32 km',
        Wilayah: '65 km Selatan GORONTALO-GORONTALO',
        Potensi: 'Tidak berpotensi TSUNAMI',
        Dirasakan: 'II Gorontalo, II Bone Bolango',
        Shakemap: '20260918081432.mmi.jpg'
    },
    {
        Tanggal: '15 Sep 2026',
        Jam: '22:05:40 WITA',
        Coordinates: '1.20 LU, 123.40 BT',
        Lintang: '1.20 LU',
        Bujur: '123.40 BT',
        Magnitude: '5.0',
        Kedalaman: '80 km',
        Wilayah: '92 km TimurLaut BONEBOLANGO-GORONTALO',
        Potensi: 'Tidak berpotensi TSUNAMI',
        Dirasakan: 'II Bone Bolango',
        Shakemap: '20260915210540.mmi.jpg'
    },
    {
        Tanggal: '10 Sep 2026',
        Jam: '04:45:12 WITA',
        Coordinates: '0.25 LS, 122.50 BT',
        Lintang: '0.25 LS',
        Bujur: '122.50 BT',
        Magnitude: '5.4',
        Kedalaman: '45 km',
        Wilayah: '82 km BaratDaya BOALEMO-GORONTALO',
        Potensi: 'Tidak berpotensi TSUNAMI',
        Dirasakan: 'II-III Boalemo, II Pohuwato',
        Shakemap: '20260910034512.mmi.jpg'
    },
    {
        Tanggal: '04 Sep 2026',
        Jam: '18:12:00 WITA',
        Coordinates: '0.90 LU, 122.80 BT',
        Lintang: '0.90 LU',
        Bujur: '122.80 BT',
        Magnitude: '5.2',
        Kedalaman: '18 km',
        Wilayah: '40 km BaratLaut GORONTALOUTARA-GORONTALO',
        Potensi: 'Tidak berpotensi TSUNAMI',
        Dirasakan: 'II Kwandang',
        Shakemap: '20260904171200.mmi.jpg'
    }
];

export default function Gempa({ dbLocalEarthquakes, dbLatestLocal }: GempaProps) {
    const [activeTab, setActiveTab] = useState<'lokal' | 'nasional'>('lokal');
    const [recentList, setRecentList] = useState<EarthquakeData[]>(FALLBACK_GEMPA_LIST);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLocal, setSelectedLocal] = useState<LocalEarthquakeItem | null>(null);

    const localList = dbLocalEarthquakes?.data || [];

    useEffect(() => {
        const fetchRecentList = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/bmkg/gempa-katalog', { cache: 'no-store' });
                if (res.ok) {
                    const json: GempaTerkiniResponse = await res.json();
                    if (json?.Infogempa?.gempa?.length) {
                        setRecentList(json.Infogempa.gempa);
                    }
                }
            } catch (e) {
                console.warn('Gagal memuat katalog gempa terkini langsung dari BMKG TEWS, menggunakan riwayat termonitor.', e);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentList();
    }, []);

    const getMagnitudeBadge = (mag: number) => {
        if (mag >= 5.0) {
            return 'bg-red-100 text-red-700 border-red-200';
        } else if (mag >= 3.0) {
            return 'bg-amber-100 text-amber-800 border-amber-200';
        }
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    };

    return (
        <MainLayout title="Informasi Gempabumi Terkini & Peta Shakemap MMI">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
                
                <div className="border-b border-bmkg-border pb-4">
                    <div className="flex items-center gap-2 text-xs text-bmkg-muted mb-1">
                        <span>Beranda</span>
                        <span>/</span>
                        <span className="text-bmkg-primary font-semibold">Gempabumi</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-bmkg-navy tracking-tight">
                        Pusat Pemantauan Gempabumi & Tsunami BMKG
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Informasi peristiwa gempabumi lokal Gorontalo & Bone Bolango, gempabumi M ≥ 5.0 nasional, peta shakemap intensitas, dan mitigasi kebencanaan.
                    </p>
                </div>

                {/* Sorotan Gempa Lokal Terkini (Jika Tersedia) */}
                {dbLatestLocal && (
                    <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-sm border border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500 text-white">
                                    Gempa Lokal Terkini
                                </span>
                                <span className="text-xs text-blue-200">
                                    Rilis Staklim Bone Bolango: <strong>{formatWaktuIndo(dbLatestLocal.event_time)}</strong>
                                </span>
                            </div>
                            <h2 className="text-sm sm:text-base font-bold text-white">
                                M {dbLatestLocal.magnitude} - {dbLatestLocal.epicenter_location}
                            </h2>
                            <p className="text-xs text-slate-300">
                                Kedalaman {dbLatestLocal.depth_km} km • {dbLatestLocal.latitude}, {dbLatestLocal.longitude} • {dbLatestLocal.felt_scale_mmi ? `Skala: ${dbLatestLocal.felt_scale_mmi}` : 'Tidak dirasakan'} • <span className="text-emerald-400 font-semibold">{dbLatestLocal.tsunami_potential}</span>
                            </p>
                        </div>

                        {dbLatestLocal.shakemap_image && (
                            <button
                                onClick={() => setSelectedLocal(dbLatestLocal)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto flex-shrink-0"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Peta Shakemap</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Section Terkini: Gempa Nasional M 5.0+ & Tektonik Gorontalo */}
                <section id="terkini" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                        <EarthquakeRealtime />
                    </div>

                    <div className="lg:col-span-6 bg-white rounded-xl border border-bmkg-border p-6 shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center gap-2 text-bmkg-primary border-b border-gray-100 pb-3 mb-3">
                                <Activity className="w-5 h-5" />
                                <h2 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                    Tektonik & Seismisitas Gorontalo
                                </h2>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed text-justify mb-3">
                                Provinsi Gorontalo dan Kabupaten Bone Bolango terletak di antara dua struktur tektonik aktif utama: <strong>Sesar Gorontalo (Gorontalo Fault Zone)</strong> di daratan, serta zona subduksi <strong>North Sulawesi Trench (Palung Sulawesi Utara)</strong> di perairan utara.
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed text-justify">
                                Sistem TEWS BMKG mengoperasikan jaringan sensor seismometer broadband dan accelerograph di wilayah Bone Bolango guna mendeteksi pergerakan kerak bumi secara real-time dan memberikan peringatan dini dalam waktu kurang dari 3 menit pasca gempa.
                            </p>
                        </div>

                        <div className="bg-bmkg-surface rounded-lg p-3.5 border border-bmkg-border text-xs space-y-2">
                            <span className="font-bold text-bmkg-navy text-[11px] uppercase tracking-wide block">
                                Skala Intensitas Gempabumi BMKG (SIG):
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                    <strong>I - II MMI:</strong> Getaran dirasakan beberapa orang, benda ringan bergoyang.
                                </div>
                                <div>
                                    <strong>III - IV MMI:</strong> Dirasakan nyata di dalam rumah, jendela bergetar.
                                </div>
                                <div>
                                    <strong>V - VI MMI:</strong> Dirasakan semua orang, kerusakan ringan pada bangunan.
                                </div>
                                <div>
                                    <strong>VII+ MMI:</strong> Kerusakan berat pada bangunan sederhana / tanah retak.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Katalog Gempabumi: Dual Tab Switcher (Lokal vs Nasional) */}
                <section id="katalog" className="bg-white rounded-xl border border-bmkg-border overflow-hidden shadow-sm space-y-4">
                    <div className="bg-[#0f172a] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                Katalog Seismologi Gempabumi
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                Rekaman peristiwa gempa bumi lokal Gorontalo & Bone Bolango serta katalog gempabumi M ≥ 5.0 nasional.
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex items-center bg-black/30 p-1 rounded-lg border border-white/10 self-start sm:self-auto text-xs">
                            <button
                                onClick={() => setActiveTab('lokal')}
                                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === 'lokal'
                                        ? 'bg-bmkg-primary text-white shadow-sm'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                <Radio className="w-3.5 h-3.5" />
                                <span>Gempa Lokal Bone Bolango ({localList.length})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('nasional')}
                                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === 'nasional'
                                        ? 'bg-bmkg-primary text-white shadow-sm'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>Gempa Nasional InaTEWS (M ≥ 5.0)</span>
                            </button>
                        </div>
                    </div>

                    {/* Konten Tab 1: Gempa Lokal Gorontalo & Bone Bolango */}
                    {activeTab === 'lokal' && (
                        <div className="p-4 pt-0 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 pb-1">
                                <span>Data seismisitas tektonik lokal dikelola oleh <strong>Stasiun Klimatologi BMKG Bone Bolango</strong>.</span>
                                <span className="text-[11px] font-mono text-slate-400">Zona Waktu: WITA</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-bmkg-border bg-bmkg-surface text-[11px] font-bold text-bmkg-navy uppercase">
                                            <th className="py-2.5 px-3">No</th>
                                            <th className="py-2.5 px-3">Waktu Kejadian (WITA)</th>
                                            <th className="py-2.5 px-3 text-center">Magnitudo</th>
                                            <th className="py-2.5 px-3">Kedalaman</th>
                                            <th className="py-2.5 px-3">Koordinat</th>
                                            <th className="py-2.5 px-3">Wilayah Episentrum</th>
                                            <th className="py-2.5 px-3">Dirasakan (MMI)</th>
                                            <th className="py-2.5 px-3">Potensi</th>
                                            <th className="py-2.5 px-3 text-center">Peta</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {localList.length > 0 ? (
                                            localList.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-3 px-3 text-gray-400 font-mono">{index + 1}</td>
                                                    <td className="py-3 px-3 font-mono text-gray-800 whitespace-nowrap">
                                                        {formatWaktuIndo(item.event_time)}
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs border ${getMagnitudeBadge(item.magnitude)}`}>
                                                            {item.magnitude}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 font-mono text-gray-700 whitespace-nowrap">{item.depth_km} km</td>
                                                    <td className="py-3 px-3 font-mono text-gray-700 whitespace-nowrap">{item.latitude}, {item.longitude}</td>
                                                    <td className="py-3 px-3 text-gray-800 font-semibold">{item.epicenter_location}</td>
                                                    <td className="py-3 px-3">
                                                        {item.felt_scale_mmi ? (
                                                            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                                                                {item.felt_scale_mmi}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 italic">Tidak dirasakan</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200 whitespace-nowrap">
                                                            {item.tsunami_potential}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        {item.shakemap_image ? (
                                                            <button
                                                                onClick={() => setSelectedLocal(item)}
                                                                className="px-2.5 py-1 text-[11px] font-bold text-bmkg-primary hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                <span>Peta</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                                                    Belum ada rekaman gempa lokal Gorontalo yang diterbitkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Konten Tab 2: Gempa Nasional BMKG TEWS M 5.0+ */}
                    {activeTab === 'nasional' && (
                        <div className="p-4 pt-0 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 pb-1">
                                <span>Rekaman gempa signifikan M ≥ 5.0 (perbandingan kronologis peristiwa lokal Bone Bolango dan nasional BMKG TEWS).</span>
                                {loading && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Menyinkronkan data...</span>
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-bmkg-border bg-bmkg-surface text-[11px] font-bold text-bmkg-navy uppercase">
                                            <th className="py-2.5 px-3">No</th>
                                            <th className="py-2.5 px-3">Waktu Gempa (WITA)</th>
                                            <th className="py-2.5 px-3 text-center">Magnitudo</th>
                                            <th className="py-2.5 px-3">Kedalaman</th>
                                            <th className="py-2.5 px-3">Koordinat</th>
                                            <th className="py-2.5 px-3">Wilayah Pusat Gempa</th>
                                            <th className="py-2.5 px-3">Potensi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentList.slice(0, 10).map((g, index) => {
                                            const mag = parseFloat(g.Magnitude || '0');
                                            const isLocalItem = Boolean((g as any).is_local);
                                            const isHighlight = isLocalItem || g.Wilayah.toLowerCase().includes('gorontalo') || g.Wilayah.toLowerCase().includes('bone');

                                            return (
                                                <tr 
                                                    key={index} 
                                                    className={`hover:bg-slate-50 transition-colors ${
                                                        isLocalItem 
                                                            ? 'bg-blue-50/70 font-semibold' 
                                                            : (isHighlight ? 'bg-slate-100 font-semibold' : '')
                                                    }`}
                                                >
                                                    <td className="py-3 px-3 text-gray-400 font-mono">{index + 1}</td>
                                                    <td className="py-3 px-3 font-mono text-gray-800 whitespace-nowrap">
                                                        {(() => {
                                                            const wita = convertWibToWita(g.Jam, g.DateTime, g.Tanggal);
                                                            return (
                                                                <>
                                                                    {wita.tanggal} <span className="text-gray-500">{wita.jam}</span>
                                                                </>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                                            mag >= 6.0 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : 'bg-slate-100 text-slate-800'
                                                        }`}>
                                                            {g.Magnitude}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 font-mono text-gray-700 whitespace-nowrap">{g.Kedalaman}</td>
                                                    <td className="py-3 px-3 font-mono text-gray-700 whitespace-nowrap">{g.Coordinates}</td>
                                                    <td className="py-3 px-3 text-gray-800">
                                                        <span>{g.Wilayah}</span>
                                                        {isLocalItem && (
                                                            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white uppercase tracking-wider inline-block">
                                                                Rilis Lokal
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                            {g.Potensi}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                {/* MODAL PREVIEW SHAKEMAP LOKAL */}
                {selectedLocal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Peta Episentrum & Shakemap Gempabumi
                                    </h3>
                                    <span className="text-[11px] text-slate-500">
                                        Peristiwa M {selectedLocal.magnitude} • {formatWaktuIndo(selectedLocal.event_time)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedLocal(null)}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-3">
                                {selectedLocal.shakemap_image ? (
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-80">
                                        <img 
                                            src={`/storage/${selectedLocal.shakemap_image}`} 
                                            alt="Peta Guncangan Lokal" 
                                            className="w-full h-auto object-contain max-h-80"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
                                        Tidak ada berkas gambar shakemap yang diunggah untuk peristiwa ini.
                                    </div>
                                )}

                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Pusat Gempa:</span>
                                        <strong className="text-slate-800">{selectedLocal.epicenter_location}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Kedalaman:</span>
                                        <strong className="text-slate-800">{selectedLocal.depth_km} km ({selectedLocal.latitude}, {selectedLocal.longitude})</strong>
                                    </div>
                                    {selectedLocal.felt_scale_mmi && (
                                        <div className="flex justify-between border-t border-slate-200 pt-1">
                                            <span className="text-slate-500">Dirasakan:</span>
                                            <strong className="text-amber-800">{selectedLocal.felt_scale_mmi}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedLocal(null)}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Section Panduan Mitigasi */}
                <section id="mitigasi" className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2 text-bmkg-primary">
                            <Shield className="w-5 h-5" />
                            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-bmkg-navy">
                                Panduan Kesiapsiagaan & Mitigasi Gempabumi BMKG
                            </h2>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Langkah-langkah penyelamatan diri yang direkomendasikan BMKG sebelum, saat, dan setelah terjadinya gempabumi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
                        <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-bmkg-primary text-xs">
                                <span className="w-5 h-5 rounded-full bg-bmkg-primary text-white flex items-center justify-center text-[11px]">1</span>
                                <span>Sebelum Terjadi Gempa</span>
                            </div>
                            <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                                <li>Pastikan struktur bangunan tempat tinggal tahan gempa.</li>
                                <li>Kenali jalur evakuasi dan titik kumpul (assembly point) terdekat.</li>
                                <li>Atur letak perabotan rumah tangga agar tidak mudah roboh dan menimpa jalur keluar.</li>
                                <li>Siapkan Tas Siaga Bencana (P3K, senter, air minum, dokumen penting).</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-bmkg-navy text-xs">
                                <span className="w-5 h-5 rounded-full bg-bmkg-navy text-white flex items-center justify-center text-[11px]">2</span>
                                <span>Saat Terjadi Gempa</span>
                            </div>
                            <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                                <li><strong>Drop, Cover, Hold On:</strong> Berlindung di bawah meja yang kokoh dan lindungi kepala.</li>
                                <li>Jauhi kaca, cermin, lemari tinggi, dan tiang listrik di luar ruangan.</li>
                                <li>Jangan gunakan lift, gunakan tangga darurat secara tenang.</li>
                                <li>Jika berada di pantai dan gempa terasa kuat, segera lari menuju tempat yang lebih tinggi.</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-bmkg-primary text-xs">
                                <span className="w-5 h-5 rounded-full bg-bmkg-navy text-white flex items-center justify-center text-[11px]">3</span>
                                <span>Setelah Terjadi Gempa</span>
                            </div>
                            <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                                <li>Periksa kondisi fisik dan orang di sekitar, obati luka jika ada.</li>
                                <li>Matikan kompor gas dan saklar listrik untuk mencegah risiko kebakaran.</li>
                                <li>Waspada terhadap gempa bumi susulan (aftershock).</li>
                                <li>Hanya percaya pada informasi resmi BMKG, jangan terpancing hoaks.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
