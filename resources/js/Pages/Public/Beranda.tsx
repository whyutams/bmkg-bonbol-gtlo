import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import EarlyWarningBanner from '@/Components/BMKG/EarlyWarningBanner';
import EarthquakeRealtime from '@/Components/BMKG/EarthquakeRealtime';
import WeatherWidget from '@/Components/BMKG/WeatherWidget';
import { Link } from '@inertiajs/react';
import { 
    CloudSun, 
    Droplets, 
    Radio, 
    Layers, 
    FileText, 
    ArrowRight, 
    Calendar, 
    Download, 
    ShieldCheck, 
    Maximize2,
    Eye,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

interface HthSummary {
    days: number;
    maxDays: number;
    category: string;
    label: string;
    dasarian: string;
    month: string;
    year: number;
}

interface BulletinItem {
    id: number;
    title: string;
    edition?: string;
    category?: string;
    file_size?: string;
    file_type?: string;
    file_path?: string;
    download_url?: string;
    published_date?: string;
    summary?: string;
}

interface BerandaProps {
    dbWarning?: any;
    dbHthSummary?: HthSummary;
    dbLatestBulletins?: BulletinItem[];
}

export default function Beranda({ dbWarning, dbHthSummary, dbLatestBulletins = [] }: BerandaProps) {
    const hthDays = dbHthSummary?.days ?? 3;
    const hthLabel = dbHthSummary?.label ?? 'Sangat Pendek (Aman)';

    return (
        <MainLayout title="Portal Informasi Cuaca, Iklim, dan Gempabumi">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 space-y-6">
                
                {/* Peringatan Dini Cuaca */}
                <section aria-label="Peringatan Dini Cuaca">
                    <EarlyWarningBanner dbWarning={dbWarning} />
                </section>

                {/* Informasi Cuaca dan Gempabumi Utama */}
                <section aria-label="Informasi Cuaca dan Gempabumi Utama">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        <div className="lg:col-span-7 flex flex-col space-y-6">
                            <WeatherWidget />

                            {/* Status Iklim Terkini dari Database */}
                            <div className="bg-white rounded-xl border border-bmkg-border p-4 shadow-sm">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-4 h-4 text-bmkg-accent" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-bmkg-navy">
                                            Status Iklim Bone Bolango Terkini
                                        </h3>
                                    </div>
                                    <Link 
                                        href="/iklim" 
                                        className="text-[11px] font-bold text-bmkg-primary hover:text-bmkg-secondary flex items-center gap-1"
                                    >
                                        <span>Selengkapnya</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                    <div className="p-2.5 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                        <span className="text-[10px] text-gray-500 uppercase block">Monitoring HTH</span>
                                        <div className="font-mono text-xl font-bold text-bmkg-navy mt-0.5">{hthDays} Hari</div>
                                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded truncate block mt-1" title={hthLabel}>
                                            {hthLabel}
                                        </span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                        <span className="text-[10px] text-gray-500 uppercase block">Curah Hujan Bulan</span>
                                        <div className="font-mono text-xl font-bold text-bmkg-navy mt-0.5">185 mm</div>
                                        <span className="text-[10px] text-gray-500 block mt-1">Kategori Menengah</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                        <span className="text-[10px] text-gray-500 uppercase block">Sifat Hujan</span>
                                        <div className="font-mono text-lg font-bold text-bmkg-navy mt-1">Normal</div>
                                        <span className="text-[10px] text-gray-500 block mt-1">85% - 115%</span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                        <span className="text-[10px] text-gray-500 uppercase block">Indeks ENSO</span>
                                        <div className="font-mono text-lg font-bold text-bmkg-navy mt-1">Netral</div>
                                        <span className="text-[10px] text-gray-500 block mt-1">Nino 3.4 (+0.2°C)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gempabumi Terkini & Satelit */}
                        <div className="lg:col-span-5 flex flex-col space-y-6">
                            <EarthquakeRealtime />

                            <div className="bg-white rounded-xl border border-bmkg-border shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-[#0f172a] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-4 h-4 text-slate-400" />
                                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                            Citra Satelit Himawari-9
                                        </h3>
                                    </div>
                                    <span className="text-[10px] text-slate-400">Inframerah Enhanced</span>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900 group">
                                        <img 
                                            src="https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_EH_Indonesia.png"
                                            alt="Citra Satelit Himawari 9 BMKG"
                                            className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://satelit.bmkg.go.id/IMAGE/ANIMASI/H08_EH_Indonesia_m10.gif';
                                            }}
                                        />
                                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono border border-white/20">
                                            Wilayah Indonesia & Gorontalo
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-2 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5 font-medium">
                                            <span>Kategori Suhu Puncak Awan:</span>
                                            <span>Data BMKG</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1 text-[9px] text-center font-bold">
                                            <div className="py-1 rounded bg-[#1a1a2e] text-white">Cerah</div>
                                            <div className="py-1 rounded bg-[#1e5a9c] text-white">Berawan</div>
                                            <div className="py-1 rounded bg-[#00c8e0] text-black">Mendung</div>
                                            <div className="py-1 rounded bg-[#f0b840] text-black">Hujan</div>
                                            <div className="py-1 rounded bg-[#e03a3a] text-white">CB / Lebat</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-xs">
                                        <span className="text-[11px] text-gray-500">Pembaruan tiap 10 menit</span>
                                        <Link 
                                            href="/cuaca#satelit" 
                                            className="text-bmkg-primary hover:text-bmkg-secondary font-bold text-[11px] flex items-center gap-1"
                                        >
                                            <span>Buka Pengamatan Lengkap</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Layanan Publik */}
                <section aria-label="Layanan Publik dan Unduhan" className="pt-2">
                    <div className="border-b-2 border-bmkg-primary pb-2 mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Pelayanan Publik & Informasi
                            </span>
                            <h2 className="text-base sm:text-lg font-extrabold text-bmkg-navy">
                                Layanan Terpadu Satu Pintu (PTSP) Staklim Bone Bolango
                            </h2>
                        </div>
                        <Link 
                            href="/layanan" 
                            className="text-xs font-bold text-bmkg-primary hover:text-bmkg-secondary flex items-center gap-1"
                        >
                            <span>Semua Layanan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/layanan#form"
                            className="bg-white p-5 rounded-xl border border-bmkg-border hover:border-slate-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                                    📋
                                </div>
                                <h3 className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary mb-1">
                                    Formulir Permintaan Data
                                </h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Pengajuan data iklim, curah hujan historis, suhu udara, dan konsultasi meteorologi secara online.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-[11px] font-bold text-bmkg-navy group-hover:text-bmkg-primary group-hover:translate-x-1 transition-all">
                                <span>Ajukan Permohonan →</span>
                            </div>
                        </Link>

                        <Link
                            href="/layanan#pnbp"
                            className="bg-white p-5 rounded-xl border border-bmkg-border hover:border-slate-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                                    💰
                                </div>
                                <h3 className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary mb-1">
                                    Tarif Resmi PNBP
                                </h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Ketentuan tarif Penerimaan Negara Bukan Pajak (PNBP) sesuai PP No. 47 Tahun 2018 resmi BMKG.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-[11px] font-bold text-bmkg-navy group-hover:text-bmkg-primary group-hover:translate-x-1 transition-all">
                                <span>Lihat Rincian Tarif →</span>
                            </div>
                        </Link>

                        <Link
                            href="/layanan#gratis"
                            className="bg-white p-5 rounded-xl border border-bmkg-border hover:border-slate-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                                    📄
                                </div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <h3 className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary">
                                        Surat Bebas Biaya (Rp 0)
                                    </h3>
                                </div>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Pelayanan tarif 0 rupiah untuk tugas akhir mahasiswa, riset pendidikan, penanggulangan bencana & instansi pemerintah.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-[11px] font-bold text-bmkg-navy group-hover:text-bmkg-primary group-hover:translate-x-1 transition-all">
                                <span>Syarat & Prosedur →</span>
                            </div>
                        </Link>

                        <Link
                            href="/layanan#ikm"
                            className="bg-white p-5 rounded-xl border border-bmkg-border hover:border-slate-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                                    📊
                                </div>
                                <h3 className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary mb-1">
                                    Survey Kepuasan (IKM)
                                </h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Bantu kami meningkatkan kualitas layanan publik dengan mengisi formulir Indeks Kepuasan Masyarakat.
                                </p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-[11px] font-bold text-bmkg-navy group-hover:text-bmkg-primary group-hover:translate-x-1 transition-all">
                                <span>Isi Kuesioner IKM →</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Kabar Terkini & Publikasi Resmi dari Database */}
                <section aria-label="Berita dan Artikel" className="pt-4">
                    <div className="border-b-2 border-bmkg-primary pb-2 mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Kabar Terkini & Publikasi
                            </span>
                            <h2 className="text-base sm:text-lg font-extrabold text-bmkg-navy">
                                Berita dan Publikasi Iklim BMKG Bone Bolango
                            </h2>
                        </div>
                        <Link 
                            href="/iklim#buletin" 
                            className="text-xs font-bold text-bmkg-primary hover:text-bmkg-secondary flex items-center gap-1"
                        >
                            <span>Semua Publikasi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {dbLatestBulletins.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {dbLatestBulletins.map((bulletin) => {
                                const downloadUrl = bulletin.download_url && bulletin.download_url !== '#'
                                    ? bulletin.download_url
                                    : (bulletin.file_path ? `/storage/${bulletin.file_path}` : '/iklim#buletin');

                                return (
                                    <div 
                                        key={bulletin.id}
                                        className="bg-white rounded-xl border border-bmkg-border overflow-hidden shadow-sm flex flex-col justify-between hover:border-bmkg-accent transition-all"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-bmkg-primary font-semibold text-[10px] uppercase">
                                                    {bulletin.category || 'IKLIM & CUACA'}
                                                </span>
                                                <span>{bulletin.published_date || bulletin.edition}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-bmkg-navy hover:text-bmkg-primary transition-colors line-clamp-2 mb-2">
                                                {bulletin.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                {bulletin.summary || 'Rilis publikasi iklim resmi Stasiun Klimatologi BMKG Bone Bolango.'}
                                            </p>
                                        </div>
                                        <div className="px-5 py-3 bg-bmkg-surface border-t border-gray-100 text-xs font-semibold text-bmkg-primary flex items-center justify-between">
                                            <Link href="/iklim#buletin" className="hover:underline">
                                                Baca Selengkapnya
                                            </Link>
                                            <span className="text-gray-400 text-[10px] font-mono">
                                                {bulletin.file_size || 'PDF'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                            Belum ada rilis publikasi terbaru.
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
