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
    HelpCircle
} from 'lucide-react';
import { EarthquakeData, GempaTerkiniResponse } from '@/types/bmkg';

const FALLBACK_GEMPA_LIST: EarthquakeData[] = [
    {
        Tanggal: '19 Sep 2026',
        Jam: '14:22:10 WIB',
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
        Jam: '08:14:32 WIB',
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
        Jam: '21:05:40 WIB',
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
        Jam: '03:45:12 WIB',
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
        Jam: '17:12:00 WIB',
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

export default function Gempa() {
    const [recentList, setRecentList] = useState<EarthquakeData[]>(FALLBACK_GEMPA_LIST);
    const [loading, setLoading] = useState<boolean>(false);

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
                        Informasi peristiwa gempabumi terkini M ≥ 5.0, peta intensitas guncangan (shakemap), dan katalog seismologi nasional.
                    </p>
                </div>

                
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
                                Sistem TEWS (Tsunami Early Warning System) BMKG mengoperasikan jaringan sensor seismometer broadband dan accelerograph di wilayah Bone Bolango guna mendeteksi pergerakan kerak bumi secara real-time dan memberikan peringatan dini dalam waktu kurang dari 3 menit pasca gempa.
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

                
                <section id="dirasakan" className="bg-white rounded-xl border border-bmkg-border overflow-hidden shadow-sm space-y-4">
                    <div className="bg-[#0f172a] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                Katalog Gempabumi M ≥ 5.0 Terkini (BMKG TEWS)
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                Rekaman peristiwa gempa bumi signifikan di wilayah Indonesia dan perairan sekitarnya.
                            </p>
                        </div>
                        {loading && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyinkronkan data...</span>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 pt-0">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-bmkg-border bg-bmkg-surface text-[11px] font-bold text-bmkg-navy uppercase">
                                    <th className="py-2.5 px-3">No</th>
                                    <th className="py-2.5 px-3">Waktu Gempa (WIB)</th>
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
                                    const isHighlight = g.Wilayah.toLowerCase().includes('gorontalo') || g.Wilayah.toLowerCase().includes('bone');

                                    return (
                                        <tr 
                                            key={index} 
                                            className={`hover:bg-slate-50 transition-colors ${
                                                isHighlight ? 'bg-slate-100 font-semibold' : ''
                                            }`}
                                        >
                                            <td className="py-3 px-3 text-gray-400 font-mono">{index + 1}</td>
                                            <td className="py-3 px-3 font-mono text-gray-800">
                                                {g.Tanggal} <span className="text-gray-500">{g.Jam}</span>
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
                                            <td className="py-3 px-3 font-mono text-gray-700">{g.Kedalaman}</td>
                                            <td className="py-3 px-3 font-mono text-gray-700">{g.Coordinates}</td>
                                            <td className="py-3 px-3 text-gray-800">{g.Wilayah}</td>
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
                </section>

                
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
