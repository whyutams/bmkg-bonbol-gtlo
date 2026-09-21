import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    CloudRain, 
    Droplets, 
    Calendar, 
    Download, 
    FileSpreadsheet, 
    FileText, 
    TrendingUp, 
    Filter, 
    Info, 
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ClimateHTHItem, ClimateBulletin } from '@/types/bmkg';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HTH_DATA: ClimateHTHItem[] = [
    { wilayah: 'Suwawa (Bone Bolango)', hari: 3, kategori: '1-5 hari', keterangan: 'Kondisi Aman / Tidak Terindikasi Kekeringan' },
    { wilayah: 'Kabila (Bone Bolango)', hari: 4, kategori: '1-5 hari', keterangan: 'Kondisi Aman / Hujan Ringan Terakhir 4 Hari Lalu' },
    { wilayah: 'Tilongkabila (Bone Bolango)', hari: 2, kategori: '1-5 hari', keterangan: 'Kondisi Aman / Terjadi Hujan Lokal' },
    { wilayah: 'Bonepantai (Bone Bolango)', hari: 6, kategori: '6-10 hari', keterangan: 'Kategori Pendek / Pemantauan Normal' },
    { wilayah: 'Bulango Ulu (Bone Bolango)', hari: 1, kategori: '1-5 hari', keterangan: 'Kondisi Sangat Basah / Ada Hujan' },
    { wilayah: 'Pinogu (Bone Bolango)', hari: 0, kategori: 'Ada Hujan', keterangan: 'Hujan Mengguyur Hari Ini (19 mm)' },
    { wilayah: 'Kota Gorontalo', hari: 4, kategori: '1-5 hari', keterangan: 'Kondisi Aman' },
    { wilayah: 'Limboto (Kab. Gorontalo)', hari: 5, kategori: '1-5 hari', keterangan: 'Kondisi Aman' },
    { wilayah: 'Tilamuta (Boalemo)', hari: 12, kategori: '11-20 hari', keterangan: 'Kategori Menengah / Waspada Pengairan Sawah' },
    { wilayah: 'Marisa (Pohuwato)', hari: 8, kategori: '6-10 hari', keterangan: 'Kategori Pendek' },
    { wilayah: 'Kwandang (Gorontalo Utara)', hari: 3, kategori: '1-5 hari', keterangan: 'Kondisi Aman' }
];

const MONTHLY_RAINFALL = {
    'Bone Bolango': {
        2026: [165, 150, 195, 180, 130, 88, 55, 40, 50, 82, 235, 395],
        normal: [145, 135, 170, 158, 108, 72, 42, 33, 40, 68, 200, 345]
    },
    'Kota Gorontalo': {
        2026: [180, 165, 210, 195, 140, 95, 60, 45, 55, 90, 250, 412],
        normal: [155, 148, 182, 168, 118, 78, 48, 38, 46, 80, 222, 365]
    },
    'Kab. Gorontalo': {
        2026: [200, 185, 225, 205, 150, 100, 65, 48, 58, 95, 265, 430],
        normal: [168, 160, 195, 178, 125, 82, 50, 40, 48, 85, 235, 378]
    },
    'Boalemo': {
        2026: [220, 205, 245, 225, 165, 110, 70, 52, 62, 100, 280, 450],
        normal: [188, 175, 212, 195, 138, 88, 55, 44, 52, 86, 248, 400]
    },
    'Pohuwato': {
        2026: [140, 128, 168, 155, 108, 72, 44, 32, 40, 68, 198, 335],
        normal: [122, 112, 148, 135, 90, 58, 35, 27, 33, 56, 175, 295]
    },
    'Gorontalo Utara': {
        2026: [190, 175, 215, 198, 145, 96, 62, 46, 56, 92, 255, 418],
        normal: [160, 150, 186, 170, 118, 78, 46, 37, 44, 78, 222, 362]
    }
};

const BULLETINS: ClimateBulletin[] = [
    {
        id: '1',
        title: 'Buletin Informasi Iklim Provinsi Gorontalo - Edisi September 2026',
        edition: 'September 2026',
        fileSize: '3.4 MB',
        fileType: 'PDF',
        category: 'buletin',
        downloadUrl: '#',
        publishedDate: '15 Sep 2026'
    },
    {
        id: '2',
        title: 'Peta Prakiraan Awal Musim Hujan 2026/2027 Wilayah Gorontalo',
        edition: 'Prakiraan 2026/2027',
        fileSize: '4.8 MB',
        fileType: 'PNG',
        category: 'peta',
        downloadUrl: '#',
        publishedDate: '01 Sep 2026'
    },
    {
        id: '3',
        title: 'Data Curah Hujan Bulanan Stasiun Pos Hujan Bone Bolango Tahun 2025',
        edition: 'Tahun 2025',
        fileSize: '1.2 MB',
        fileType: 'XLSX',
        category: 'laporan',
        downloadUrl: '#',
        publishedDate: '10 Jan 2026'
    },
    {
        id: '4',
        title: 'Buletin Informasi Iklim Provinsi Gorontalo - Edisi Agustus 2026',
        edition: 'Agustus 2026',
        fileSize: '3.1 MB',
        fileType: 'PDF',
        category: 'buletin',
        downloadUrl: '#',
        publishedDate: '15 Agu 2026'
    }
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

export default function Iklim() {
    const [selectedRegion, setSelectedRegion] = useState<keyof typeof MONTHLY_RAINFALL>('Bone Bolango');
    const [bulletinFilter, setBulletinFilter] = useState<'all' | 'buletin' | 'peta' | 'laporan'>('all');

    const regionData = MONTHLY_RAINFALL[selectedRegion];

    const chartData = {
        labels: MONTH_LABELS,
        datasets: [
            {
                type: 'bar' as const,
                label: `Curah Hujan 2026 (mm) - ${selectedRegion}`,
                data: regionData[2026],
                backgroundColor: regionData[2026].map(v => v > 300 ? '#dc2626' : '#1a6fc4'),
                borderRadius: 4,
                maxBarThickness: 32,
            },
            {
                type: 'line' as const,
                label: 'Normal Klimatologis 30 Tahun (mm)',
                data: regionData.normal,
                borderColor: '#ea580c',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ea580c',
                fill: false,
                tension: 0.3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: { family: 'Inter', size: 11 },
                    usePointStyle: true
                }
            },
            tooltip: {
                titleFont: { family: 'Inter', size: 12 },
                bodyFont: { family: 'IBM Plex Mono', size: 12 },
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw} mm`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11 } }
            },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: {
                    font: { family: 'IBM Plex Mono', size: 11 },
                    callback: (value: any) => `${value} mm`
                }
            }
        }
    };

    const handleExportCSV = () => {
        const rows = [['Bulan', `Curah Hujan 2026 - ${selectedRegion} (mm)`, 'Normal Klimatologis (mm)']];
        MONTH_LABELS.forEach((m, idx) => {
            rows.push([m, String(regionData[2026][idx]), String(regionData.normal[idx])]);
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `data_curah_hujan_${selectedRegion.toLowerCase().replace(/\s+/g, '_')}_2026.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredBulletins = bulletinFilter === 'all' 
        ? BULLETINS 
        : BULLETINS.filter(b => b.category === bulletinFilter);

    return (
        <MainLayout title="Informasi Iklim, Monitoring HTH, dan Curah Hujan">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
                
                <div className="border-b border-bmkg-border pb-4">
                    <div className="flex items-center gap-2 text-xs text-bmkg-muted mb-1">
                        <span>Beranda</span>
                        <span>/</span>
                        <span className="text-bmkg-primary font-semibold">Informasi Iklim</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-bmkg-navy tracking-tight">
                        Analisis & Prakiraan Iklim BMKG Bone Bolango
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Monitoring Hari Tanpa Hujan (HTH), statistik curah hujan dasarian, prediksi musim, dan buletin resmi.
                    </p>
                </div>

                
                <section id="hth" className="bg-white rounded-xl border border-bmkg-border p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <Droplets className="w-5 h-5 text-slate-600" />
                                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-bmkg-navy">
                                    Monitoring Hari Tanpa Hujan (HTH) Berturut-turut
                                </h2>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Pemantauan deret hari kering untuk deteksi dini risiko kekeringan meteorologis dan hidrologis.
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                            Pembaruan: Dasarian II September 2026
                        </span>
                    </div>

                    
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Skala Klasifikasi BMKG:</span>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            1-5 Hari: Sangat Pendek (Aman)
                        </span>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            6-10 Hari: Pendek
                        </span>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                            11-20 Hari: Menengah
                        </span>
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-red-100 text-red-800">
                            &gt;20 Hari: Panjang / Sangat Panjang
                        </span>
                    </div>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {HTH_DATA.map((item, idx) => {
                            let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                            if (item.kategori === '6-10 hari') badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
                            if (item.kategori === '11-20 hari') badgeStyle = 'bg-orange-50 text-orange-800 border-orange-200';
                            if (item.kategori === '>30 hari' || item.kategori === '21-30 hari') badgeStyle = 'bg-red-50 text-red-800 border-red-200';

                            return (
                                <div 
                                    key={idx}
                                    className="p-3.5 rounded-xl border border-bmkg-border/80 bg-bmkg-surface flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h4 className="text-xs font-bold text-bmkg-navy">
                                            {item.wilayah}
                                        </h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle}`}>
                                            {item.hari} Hari HTH
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-600">
                                        {item.keterangan}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                
                <section id="analisis" className="bg-white rounded-xl border border-bmkg-border p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <CloudRain className="w-5 h-5 text-bmkg-accent" />
                                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-bmkg-navy">
                                    Analisis Curah Hujan Bulanan vs Normal Klimatologis 30 Tahun
                                </h2>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Perbandingan curah hujan akumulasi bulanan dengan rata-rata historis (1991 - 2020).
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value as any)}
                                className="text-xs font-semibold border border-bmkg-border rounded-lg bg-white px-3 py-1.5 text-bmkg-navy outline-none focus:ring-1 focus:ring-bmkg-accent"
                            >
                                {Object.keys(MONTHLY_RAINFALL).map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>

                            <button
                                onClick={handleExportCSV}
                                className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh CSV</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-72 sm:h-80 w-full pt-2">
                        <Bar data={chartData as any} options={chartOptions} />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-gray-700 flex items-start gap-2">
                        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong>Catatan Analisis:</strong> Batang merah menandai bulan dengan curah hujan tinggi/ekstrem (&gt;300 mm). Garis oranye putus-putus menggambarkan normal klimatologis rata-rata 30 tahun wilayah {selectedRegion}.
                        </div>
                    </div>
                </section>

                
                <section id="prediksi" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-bmkg-border p-5 sm:p-6 shadow-sm space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                Prakiraan Sifat & Peluang Hujan Dasarian
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Prediksi sifat curah hujan probabilistik untuk 3 periode dasarian ke depan di Bone Bolango.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Dasarian III Sept</span>
                                <div className="font-mono text-2xl font-black text-bmkg-navy mt-1">45 mm</div>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    Normal (N)
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Dasarian I Okt</span>
                                <div className="font-mono text-2xl font-black text-bmkg-navy mt-1">68 mm</div>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    Atas Normal (AN)
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-bmkg-surface border border-bmkg-border text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Dasarian II Okt</span>
                                <div className="font-mono text-2xl font-black text-bmkg-navy mt-1">35 mm</div>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    Bawah Normal (BN)
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed pt-1">
                            Sifat hujan <strong>Atas Normal (AN)</strong> menunjukkan akumulasi curah hujan lebih tinggi dari 115% nilai klimatologis, sedangkan <strong>Bawah Normal (BN)</strong> berada di bawah 85% normal. Informasi ini dapat digunakan sebagai pertimbangan kalender tanam komoditas pangan.
                        </p>
                    </div>

                    
                    <div className="bg-[#0f172a] text-white rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between border border-slate-800">
                        <div>
                            <span className="text-[10px] font-bold text-sky-200 uppercase tracking-widest block mb-1">
                                Zona Musim (ZOM)
                            </span>
                            <h3 className="text-base font-bold text-white mb-2">
                                Karakteristik Musim Gorontalo
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                                Wilayah Kabupaten Bone Bolango terbagi ke dalam Zona Musim ZOM 352 dan ZOM 353 yang memiliki pengaruh iklim ekuatorial dengan tipe curah hujan semi-bimodal.
                            </p>

                            <div className="mt-4 space-y-2 text-xs border-t border-white/15 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Puncak Musim Hujan:</span>
                                    <strong>Desember - Januari</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Puncak Musim Kemarau:</span>
                                    <strong>Juli - Agustus</strong>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-white/15 text-[11px] text-sky-200">
                            Stasiun Klimatologi BMKG Bone Bolango
                        </div>
                    </div>
                </section>

                
                <section id="buletin" className="space-y-4">
                    <div className="border-b-2 border-bmkg-primary pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Publikasi Resmi
                            </span>
                            <h3 className="text-base font-extrabold text-bmkg-navy">
                                Unduhan Dokumen & Buletin Iklim Staklim Bone Bolango
                            </h3>
                        </div>

                        
                        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
                            <button
                                onClick={() => setBulletinFilter('all')}
                                className={`px-2.5 py-1 rounded-md font-semibold ${
                                    bulletinFilter === 'all' ? 'bg-bmkg-primary text-white' : 'bg-white text-gray-600 border'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setBulletinFilter('buletin')}
                                className={`px-2.5 py-1 rounded-md font-semibold ${
                                    bulletinFilter === 'buletin' ? 'bg-bmkg-primary text-white' : 'bg-white text-gray-600 border'
                                }`}
                            >
                                Buletin
                            </button>
                            <button
                                onClick={() => setBulletinFilter('peta')}
                                className={`px-2.5 py-1 rounded-md font-semibold ${
                                    bulletinFilter === 'peta' ? 'bg-bmkg-primary text-white' : 'bg-white text-gray-600 border'
                                }`}
                            >
                                Peta Musim
                            </button>
                            <button
                                onClick={() => setBulletinFilter('laporan')}
                                className={`px-2.5 py-1 rounded-md font-semibold ${
                                    bulletinFilter === 'laporan' ? 'bg-bmkg-primary text-white' : 'bg-white text-gray-600 border'
                                }`}
                            >
                                Data Tabel
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredBulletins.map((doc) => (
                            <div 
                                key={doc.id}
                                className="bg-white p-4 rounded-xl border border-bmkg-border shadow-xs hover:border-bmkg-accent transition-all flex items-start justify-between gap-3"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-bmkg-light flex items-center justify-center font-mono font-bold text-bmkg-primary text-xs flex-shrink-0">
                                        {doc.fileType}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-bmkg-navy leading-snug">
                                            {doc.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                                            <span>{doc.publishedDate}</span>
                                            <span>•</span>
                                            <span className="font-mono">{doc.fileSize}</span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={doc.downloadUrl}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert(`Mengunduh dokumen: ${doc.title}`);
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-bmkg-primary text-bmkg-primary hover:bg-bmkg-primary hover:text-white text-xs font-bold flex items-center gap-1 transition-colors flex-shrink-0"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
