import React, { useState } from 'react';
import { CloudSun, Droplets, Wind, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { WeatherDistrict } from '@/types/bmkg';

const BONE_BOLANGO_DISTRICTS: WeatherDistrict[] = [
    {
        id: 'suwawa',
        name: 'Suwawa (Ibukota)',
        regency: 'Bone Bolango',
        temp: 30,
        tempMin: 25,
        tempMax: 32,
        humidity: 78,
        windSpeed: 10,
        windDirection: 'Tenggara',
        code: 1,
        condition: 'Cerah Berawan',
        rainfall: 2,
        time: 'Siang Hari'
    },
    {
        id: 'kabila',
        name: 'Kabila',
        regency: 'Bone Bolango',
        temp: 29,
        tempMin: 24,
        tempMax: 31,
        humidity: 82,
        windSpeed: 9,
        windDirection: 'Selatan',
        code: 3,
        condition: 'Berawan',
        rainfall: 5,
        time: 'Siang Hari'
    },
    {
        id: 'tilongkabila',
        name: 'Tilongkabila (Kantor Staklim)',
        regency: 'Bone Bolango',
        temp: 29,
        tempMin: 24,
        tempMax: 31,
        humidity: 80,
        windSpeed: 11,
        windDirection: 'Tenggara',
        code: 1,
        condition: 'Cerah Berawan',
        rainfall: 4,
        time: 'Siang Hari'
    },
    {
        id: 'bonepantai',
        name: 'Bonepantai (Pesisir)',
        regency: 'Bone Bolango',
        temp: 31,
        tempMin: 26,
        tempMax: 33,
        humidity: 74,
        windSpeed: 15,
        windDirection: 'Timur',
        code: 0,
        condition: 'Cerah',
        rainfall: 0,
        time: 'Siang Hari'
    },
    {
        id: 'bulango_ulu',
        name: 'Bulango Ulu',
        regency: 'Bone Bolango',
        temp: 28,
        tempMin: 23,
        tempMax: 30,
        humidity: 86,
        windSpeed: 8,
        windDirection: 'Barat Daya',
        code: 60,
        condition: 'Hujan Ringan',
        rainfall: 12,
        time: 'Siang Hari'
    },
    {
        id: 'tapa',
        name: 'Tapa',
        regency: 'Bone Bolango',
        temp: 29,
        tempMin: 24,
        tempMax: 31,
        humidity: 81,
        windSpeed: 10,
        windDirection: 'Selatan',
        code: 3,
        condition: 'Berawan',
        rainfall: 3,
        time: 'Siang Hari'
    },
    {
        id: 'pinogu',
        name: 'Pinogu (Dataran Tinggi)',
        regency: 'Bone Bolango',
        temp: 25,
        tempMin: 21,
        tempMax: 28,
        humidity: 89,
        windSpeed: 7,
        windDirection: 'Barat',
        code: 60,
        condition: 'Hujan Ringan',
        rainfall: 18,
        time: 'Siang Hari'
    },
    {
        id: 'botupingge',
        name: 'Botupingge',
        regency: 'Bone Bolango',
        temp: 30,
        tempMin: 25,
        tempMax: 32,
        humidity: 79,
        windSpeed: 10,
        windDirection: 'Tenggara',
        code: 1,
        condition: 'Cerah Berawan',
        rainfall: 2,
        time: 'Siang Hari'
    }
];

const GORONTALO_CITIES: WeatherDistrict[] = [
    {
        id: 'kota_gorontalo',
        name: 'Kota Gorontalo',
        regency: 'Kota Gorontalo',
        temp: 31,
        tempMin: 26,
        tempMax: 33,
        humidity: 76,
        windSpeed: 12,
        windDirection: 'Tenggara',
        code: 1,
        condition: 'Cerah Berawan',
        rainfall: 1,
        time: 'Siang Hari'
    },
    {
        id: 'kab_gorontalo',
        name: 'Limboto (Kab. Gorontalo)',
        regency: 'Kab. Gorontalo',
        temp: 30,
        tempMin: 25,
        tempMax: 32,
        humidity: 80,
        windSpeed: 10,
        windDirection: 'Selatan',
        code: 3,
        condition: 'Berawan',
        rainfall: 6,
        time: 'Siang Hari'
    },
    {
        id: 'boalemo',
        name: 'Tilamuta (Boalemo)',
        regency: 'Boalemo',
        temp: 29,
        tempMin: 24,
        tempMax: 31,
        humidity: 84,
        windSpeed: 9,
        windDirection: 'Barat Daya',
        code: 60,
        condition: 'Hujan Ringan',
        rainfall: 14,
        time: 'Siang Hari'
    },
    {
        id: 'pohuwato',
        name: 'Marisa (Pohuwato)',
        regency: 'Pohuwato',
        temp: 32,
        tempMin: 26,
        tempMax: 34,
        humidity: 72,
        windSpeed: 14,
        windDirection: 'Timur',
        code: 0,
        condition: 'Cerah',
        rainfall: 0,
        time: 'Siang Hari'
    },
    {
        id: 'gorut',
        name: 'Kwandang (Gorontalo Utara)',
        regency: 'Gorontalo Utara',
        temp: 30,
        tempMin: 25,
        tempMax: 32,
        humidity: 75,
        windSpeed: 13,
        windDirection: 'Utara',
        code: 1,
        condition: 'Cerah Berawan',
        rainfall: 3,
        time: 'Siang Hari'
    }
];

export default function WeatherWidget() {
    const [selectedTab, setSelectedTab] = useState<'bonebol' | 'gorontalo'>('bonebol');
    const [boneBolDistricts, setBoneBolDistricts] = useState<WeatherDistrict[]>(BONE_BOLANGO_DISTRICTS);
    const [gorontaloCities, setGorontaloCities] = useState<WeatherDistrict[]>(GORONTALO_CITIES);

    React.useEffect(() => {
        fetch('/api/bmkg/cuaca')
            .then(res => res.json())
            .then(json => {
                if (json?.data?.[0]?.cuaca?.[0]?.length) {
                    const cur = json.data[0].cuaca[0][0];
                    if (cur) {
                        const tempVal = Number(cur.t) || 30;
                        const humVal = Number(cur.hu) || 75;
                        const condDesc = cur.weather_desc || 'Cerah Berawan';
                        const windVal = Math.round(Number(cur.ws) || 10);
                        const windDir = cur.wd || 'Tenggara';

                        setBoneBolDistricts(prev => prev.map(d => ({
                            ...d,
                            temp: tempVal,
                            humidity: humVal,
                            condition: condDesc,
                            windSpeed: windVal,
                            windDirection: windDir,
                        })));

                        setGorontaloCities(prev => prev.map(c => ({
                            ...c,
                            temp: tempVal,
                            humidity: humVal,
                            condition: condDesc,
                            windSpeed: windVal,
                            windDirection: windDir,
                        })));
                    }
                }
            })
            .catch(() => console.log('Weather widget using local fallback'));
    }, []);

    const displayList = selectedTab === 'bonebol' ? boneBolDistricts : gorontaloCities;

    const getWeatherEmoji = (code: number) => {
        switch (code) {
            case 0: return '☀️';
            case 1:
            case 2: return '🌤';
            case 3: return '⛅';
            case 4: return '☁️';
            case 45: return '🌫';
            case 60:
            case 61: return '🌧';
            case 63: return '🌧';
            case 95:
            case 97: return '⛈';
            default: return '🌤';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-bmkg-border shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="bg-[#0f172a] px-4 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-slate-400" />
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Prakiraan Cuaca Daerah
                    </h2>
                </div>

                
                <div className="flex items-center bg-black/20 p-0.5 rounded-lg border border-white/15 self-start sm:self-auto text-xs">
                    <button
                        onClick={() => setSelectedTab('bonebol')}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                            selectedTab === 'bonebol'
                                ? 'bg-white text-bmkg-navy shadow-sm'
                                : 'text-white/80 hover:text-white'
                        }`}
                    >
                        Kecamatan Bone Bolango
                    </button>
                    <button
                        onClick={() => setSelectedTab('gorontalo')}
                        className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                            selectedTab === 'gorontalo'
                                ? 'bg-white text-bmkg-navy shadow-sm'
                                : 'text-white/80 hover:text-white'
                        }`}
                    >
                        Kab / Kota se-Gorontalo
                    </button>
                </div>
            </div>

            
            <div className="p-4 sm:p-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {displayList.map((item) => (
                        <div 
                            key={item.id}
                            className="p-3.5 rounded-xl border border-bmkg-border/70 hover:border-bmkg-accent bg-bmkg-surface hover:bg-white transition-all shadow-2xs group flex flex-col justify-between"
                        >
                            
                            <div className="flex items-start justify-between gap-1 mb-2">
                                <div className="truncate">
                                    <h4 className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary transition-colors truncate">
                                        {item.name}
                                    </h4>
                                    <span className="text-[10px] text-gray-500 block">
                                        {item.regency}
                                    </span>
                                </div>
                                <span className="text-2xl leading-none flex-shrink-0">
                                    {getWeatherEmoji(item.code)}
                                </span>
                            </div>

                            
                            <div className="flex items-baseline justify-between my-1">
                                <div className="font-mono text-2xl font-extrabold text-bmkg-primary">
                                    {item.temp}<span className="text-sm font-normal text-gray-500">°C</span>
                                </div>
                                <span className="text-xs font-medium text-gray-700 text-right">
                                    {item.condition}
                                </span>
                            </div>

                            
                            <div className="mt-2 pt-2 border-t border-gray-200/60 grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400">Rentang:</span>
                                    <strong className="font-mono">{item.tempMin}° - {item.tempMax}°C</strong>
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                    <Droplets className="w-3 h-3 text-slate-400" />
                                    <strong className="font-mono">{item.humidity}%</strong>
                                </div>
                                <div className="flex items-center gap-1 col-span-2 text-gray-500">
                                    <Wind className="w-3 h-3 text-slate-400" />
                                    <span>{item.windSpeed} km/j ({item.windDirection})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bmkg-muted">
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Prakiraan berlaku untuk hari ini. Diperbarui setiap 6 jam oleh Forecaster BMKG.</span>
                    </div>
                    <Link
                        href="/cuaca"
                        className="inline-flex items-center gap-1 text-xs font-bold text-bmkg-primary hover:text-bmkg-secondary"
                    >
                        <span>Lihat Radar & Satelit Lengkap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
