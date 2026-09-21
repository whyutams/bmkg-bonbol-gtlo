import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    CloudSun, 
    Droplets, 
    Wind, 
    Compass, 
    Calendar, 
    Radio, 
    Maximize2, 
    Info, 
    AlertTriangle,
    Clock,
    Printer,
    ChevronRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface DistrictForecast {
    name: string;
    condition: string;
    icon: string;
    temp: number;
    min: number;
    max: number;
    humidity: number;
    wind: number;
    windDir: string;
}

const DISTRICT_LIST: DistrictForecast[] = [
    { name: 'Suwawa (Ibukota)', condition: 'Cerah Berawan', icon: '🌤', temp: 30, min: 25, max: 32, humidity: 78, wind: 10, windDir: 'Tenggara' },
    { name: 'Kabila', condition: 'Berawan', icon: '⛅', temp: 29, min: 24, max: 31, humidity: 82, wind: 9, windDir: 'Selatan' },
    { name: 'Tilongkabila', condition: 'Cerah Berawan', icon: '🌤', temp: 29, min: 24, max: 31, humidity: 80, wind: 11, windDir: 'Tenggara' },
    { name: 'Bonepantai (Pesisir)', condition: 'Cerah', icon: '☀️', temp: 31, min: 26, max: 33, humidity: 74, wind: 15, windDir: 'Timur' },
    { name: 'Bulango Ulu', condition: 'Hujan Ringan', icon: '🌧', temp: 28, min: 23, max: 30, humidity: 86, wind: 8, windDir: 'Barat Daya' },
    { name: 'Tapa', condition: 'Berawan', icon: '⛅', temp: 29, min: 24, max: 31, humidity: 81, wind: 10, windDir: 'Selatan' },
    { name: 'Pinogu (Tinggi)', condition: 'Hujan Ringan', icon: '🌧', temp: 25, min: 21, max: 28, humidity: 89, wind: 7, windDir: 'Barat' },
    { name: 'Botupingge', condition: 'Cerah Berawan', icon: '🌤', temp: 30, min: 25, max: 32, humidity: 79, wind: 10, windDir: 'Tenggara' },
    { name: 'Kota Gorontalo', condition: 'Cerah Berawan', icon: '🌤', temp: 31, min: 26, max: 33, humidity: 76, wind: 12, windDir: 'Tenggara' },
    { name: 'Limboto (Kab. Gorontalo)', condition: 'Berawan', icon: '⛅', temp: 30, min: 25, max: 32, humidity: 80, wind: 10, windDir: 'Selatan' },
    { name: 'Tilamuta (Boalemo)', condition: 'Hujan Ringan', icon: '🌧', temp: 29, min: 24, max: 31, humidity: 84, wind: 9, windDir: 'Barat Daya' },
    { name: 'Marisa (Pohuwato)', condition: 'Cerah', icon: '☀️', temp: 32, min: 26, max: 34, humidity: 72, wind: 14, windDir: 'Timur' },
    { name: 'Kwandang (Gorut)', condition: 'Cerah Berawan', icon: '🌤', temp: 30, min: 25, max: 32, humidity: 75, wind: 13, windDir: 'Utara' }
];

const HOURLY_HOURS = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00', '03:00'];
const HOURLY_TEMP = [25, 28, 31, 30, 28, 26, 25, 24];
const HOURLY_HUM = [88, 76, 68, 72, 80, 84, 88, 90];

export default function Cuaca() {
    const [selectedDistrict, setSelectedDistrict] = useState<string>('Suwawa (Ibukota)');
    const [districts, setDistricts] = useState<DistrictForecast[]>(DISTRICT_LIST);
    const [hourlyHours, setHourlyHours] = useState<string[]>(HOURLY_HOURS);
    const [hourlyTemp, setHourlyTemp] = useState<number[]>(HOURLY_TEMP);
    const [hourlyHum, setHourlyHum] = useState<number[]>(HOURLY_HUM);
    const [isLiveBmkg, setIsLiveBmkg] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/bmkg/cuaca')
            .then(res => res.json())
            .then(json => {
                if (json?.data?.[0]?.cuaca?.[0]?.length) {
                    const hourlyArr = json.data[0].cuaca[0];
                    const labels = hourlyArr.map((h: any) => h.local_datetime?.split(' ')[1]?.substring(0, 5) || '12:00');
                    const temps = hourlyArr.map((h: any) => Number(h.t) || 28);
                    const hums = hourlyArr.map((h: any) => Number(h.hu) || 75);
                    
                    setHourlyHours(labels);
                    setHourlyTemp(temps);
                    setHourlyHum(hums);
                    setIsLiveBmkg(true);

                    const currentFirst = hourlyArr[0];
                    if (currentFirst) {
                        setDistricts(prev => prev.map(d => ({
                            ...d,
                            temp: Number(currentFirst.t) || d.temp,
                            condition: currentFirst.weather_desc || d.condition,
                            humidity: Number(currentFirst.hu) || d.humidity,
                            wind: Math.round(Number(currentFirst.ws) || d.wind),
                        })));
                    }
                }
            })
            .catch(() => console.log('Menggunakan data klimatologi lokal'));
    }, []);

    const currentData = districts.find(d => d.name === selectedDistrict) || districts[0];

    const chartData = {
        labels: hourlyHours,
        datasets: [
            {
                label: 'Suhu Udara (°C)',
                data: hourlyTemp,
                borderColor: '#1a6fc4',
                backgroundColor: 'rgba(26, 111, 196, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#1a6fc4',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
            {
                label: 'Kelembaban Udara (%)',
                data: hourlyHum,
                borderColor: '#16a34a',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                yAxisID: 'y1',
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#16a34a',
                pointBorderWidth: 2,
                pointRadius: 3,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: { family: 'Inter', size: 11 },
                    usePointStyle: true,
                    boxWidth: 6,
                }
            },
            tooltip: {
                titleFont: { family: 'Inter', size: 12 },
                bodyFont: { family: 'IBM Plex Mono', size: 12 },
            }
        },
        scales: {
            x: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { family: 'IBM Plex Mono', size: 10 } }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: { color: '#f1f5f9' },
                ticks: {
                    font: { family: 'IBM Plex Mono', size: 10 },
                    callback: (value: any) => `${value}°C`
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: { drawOnChartArea: false },
                ticks: {
                    font: { family: 'IBM Plex Mono', size: 10 },
                    callback: (value: any) => `${value}%`
                }
            }
        }
    };

    return (
        <MainLayout title="Prakiraan Cuaca, Citra Satelit, dan Radar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
                
                <div className="border-b border-bmkg-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-bmkg-muted mb-1">
                            <span>Beranda</span>
                            <span>/</span>
                            <span className="text-bmkg-primary font-semibold">Prakiraan Cuaca</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-bmkg-navy tracking-tight">
                            Informasi Cuaca Wilayah Bone Bolango & Gorontalo
                        </h1>
                        <p className="text-xs text-gray-600 mt-1">
                            Pengamatan real-time, prediksi cuaca per kecamatan, citra satelit Himawari-9, dan deteksi radar.
                        </p>
                    </div>

                    <button 
                        onClick={() => window.print()} 
                        className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-bmkg-border bg-white text-xs font-semibold text-bmkg-navy hover:bg-bmkg-surface flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                        <Printer className="w-3.5 h-3.5 text-bmkg-accent" />
                        <span>Cetak Laporan</span>
                    </button>
                </div>

                
                <section id="prakiraan" className="bg-[#0f172a] rounded-2xl text-white p-6 sm:p-8 shadow-md border border-slate-800">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-white/20 border border-white/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Lokasi Terpilih
                                </span>
                                <span className="text-xs text-sky-200">
                                    Kabupaten Bone Bolango
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    {currentData.name}
                                </h2>
                                <span className="text-xs text-white/70">Waktu Observasi: 12:00 WITA</span>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <span className="text-5xl sm:text-6xl leading-none">
                                    {currentData.icon}
                                </span>
                                <div>
                                    <div className="font-mono text-4xl sm:text-5xl font-extrabold">
                                        {currentData.temp}<span className="text-2xl font-light text-white/80">°C</span>
                                    </div>
                                    <span className="text-sm sm:text-base font-semibold text-white/90">
                                        {currentData.condition}
                                    </span>
                                </div>
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto">
                            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                                    <Droplets className="w-3 h-3 text-slate-400" />
                                    <span>Kelembaban</span>
                                </div>
                                <div className="font-mono text-lg font-bold mt-0.5">{currentData.humidity}%</div>
                            </div>

                            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                                    <Wind className="w-3 h-3 text-slate-400" />
                                    <span>Kecepatan Angin</span>
                                </div>
                                <div className="font-mono text-lg font-bold mt-0.5">{currentData.wind} km/j</div>
                            </div>

                            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                                    <Compass className="w-3 h-3 text-slate-400" />
                                    <span>Arah Angin</span>
                                </div>
                                <div className="text-sm font-bold mt-0.5">{currentData.windDir}</div>
                            </div>

                            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>Rentang Harian</span>
                                </div>
                                <div className="font-mono text-sm font-bold mt-0.5">{currentData.min}° - {currentData.max}°C</div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="space-y-4">
                    <div className="border-b-2 border-bmkg-primary pb-2 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Rincian Per Wilayah
                            </span>
                            <h3 className="text-base font-extrabold text-bmkg-navy">
                                Prakiraan Cuaca Kecamatan se-Bone Bolango & Gorontalo
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {DISTRICT_LIST.map((dist) => (
                            <button
                                key={dist.name}
                                onClick={() => setSelectedDistrict(dist.name)}
                                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                    selectedDistrict === dist.name
                                        ? 'border-bmkg-primary bg-blue-50/60 ring-2 ring-bmkg-accent/30 shadow-xs'
                                        : 'border-bmkg-border bg-white hover:border-bmkg-accent/60 hover:bg-bmkg-surface'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-1 mb-1">
                                    <span className="text-xs font-bold text-bmkg-navy truncate">
                                        {dist.name}
                                    </span>
                                    <span className="text-xl leading-none">{dist.icon}</span>
                                </div>
                                <div className="font-mono text-xl font-bold text-bmkg-primary my-1">
                                    {dist.temp}°C
                                </div>
                                <div className="text-[10px] text-gray-500 truncate">
                                    {dist.condition} • {dist.humidity}%
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                
                <section className="bg-white rounded-xl border border-bmkg-border p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                Tren Suhu & Kelembaban Udara Harian ({selectedDistrict})
                            </h3>
                            <p className="text-xs text-gray-500">
                                Simulasi profil variasi diurnal atmosfer berdasarkan pemodelan numerik BMKG.
                            </p>
                        </div>
                        <span className="text-[11px] font-mono text-bmkg-muted self-start sm:self-auto">
                            Periode: 24 Jam
                        </span>
                    </div>

                    <div className="h-64 sm:h-72 w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </section>

                
                <section id="satelit" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="bg-white rounded-xl border border-bmkg-border overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#0f172a] text-white p-3.5 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Radio className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                    Citra Satelit Himawari-9 (IR Enhanced)
                                </h3>
                            </div>
                            <span className="text-[10px] text-slate-400">Resolusi Tinggi</span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="rounded-lg overflow-hidden bg-gray-900 border border-gray-200">
                                <img
                                    src="https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_EH_Indonesia.png"
                                    alt="Citra Satelit Himawari-9"
                                    className="w-full h-56 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://satelit.bmkg.go.id/IMAGE/ANIMASI/H08_EH_Indonesia_m10.gif';
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Citra inframerah menunjukkan suhu puncak awan pada spektrum 10.4 mikrometer. Warna jingga hingga merah mengindikasikan puncak awan Cumulonimbus berpotensi cuaca ekstrem/hujan lebat.
                            </p>
                            <div className="grid grid-cols-5 gap-1 text-[9px] text-center font-bold">
                                <div className="py-1 rounded bg-[#1a1a2e] text-white">Cerah</div>
                                <div className="py-1 rounded bg-[#1e5a9c] text-white">Berawan</div>
                                <div className="py-1 rounded bg-[#00c8e0] text-black">Mendung</div>
                                <div className="py-1 rounded bg-[#f0b840] text-black">Hujan</div>
                                <div className="py-1 rounded bg-[#e03a3a] text-white">CB / Lebat</div>
                            </div>
                        </div>
                    </div>

                    
                    <div id="radar" className="bg-white rounded-xl border border-bmkg-border overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#0f172a] text-white p-3.5 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Radio className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                    Radar Cuaca Doppler BMKG
                                </h3>
                            </div>
                            <span className="text-[10px] text-slate-400">C-Band Doppler</span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div className="rounded-lg overflow-hidden bg-slate-900 border border-gray-200 relative flex items-center justify-center min-h-[224px]">
                                <img
                                    src="https://inderaja.bmkg.go.id/Radar/JAL_SingleLayerCR.png"
                                    alt="Radar Cuaca BMKG"
                                    className="w-full h-56 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-900/60 backdrop-blur-2xs text-white">
                                    <Radio className="w-8 h-8 text-slate-400 mb-2 animate-pulse" />
                                    <strong className="text-xs">Radar Pengamatan Wilayah Gorontalo & Teluk Tomini</strong>
                                    <span className="text-[11px] text-slate-300 mt-1">Jangkauan 240 km - Deteksi Intensitas Reflektivitas (dBZ)</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Radar Doppler mendeteksi pertumbuhan sel awan konvektif secara real-time untuk mendukung keselamatan transportasi laut, udara, dan peringatan dini banjir bandang di DAS Bone Bolango.
                            </p>
                            <div className="p-2.5 rounded-lg bg-bmkg-surface border border-bmkg-border text-[11px] text-bmkg-muted flex items-center justify-between">
                                <span>Status Radar: <strong>Aktif / Operasional 24 Jam</strong></span>
                                <span className="font-mono text-slate-800 font-bold">ONLINE</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
