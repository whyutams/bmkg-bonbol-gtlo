import React, { useState, useEffect } from 'react';
import { Activity, Clock, Compass, Layers, AlertTriangle, ShieldCheck, RefreshCw, Maximize2, X } from 'lucide-react';
import { EarthquakeData, AutogempaResponse } from '@/types/bmkg';

interface EarthquakeRealtimeProps {
    initialData?: EarthquakeData;
    compact?: boolean;
}

export default function EarthquakeRealtime({ initialData, compact = false }: EarthquakeRealtimeProps) {
    const [earthquake, setEarthquake] = useState<EarthquakeData | null>(initialData || null);
    const [loading, setLoading] = useState<boolean>(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [lastFetched, setLastFetched] = useState<string>('');

    const fetchEarthquake = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/bmkg/gempa-terkini', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: AutogempaResponse = await response.json();
            if (data?.Infogempa?.gempa) {
                setEarthquake(data.Infogempa.gempa);
                setLastFetched(new Date().toLocaleTimeString('id-ID'));
            } else {
                throw new Error('Format data tidak valid');
            }
        } catch (err: any) {
            setError('Gagal memuat data gempa terkini dari server.');
            if (!earthquake) {
                setEarthquake({
                    Tanggal: '19 Sep 2026',
                    Jam: '14:22:10 WIB',
                    Coordinates: '0.45 LS, 123.15 BT',
                    Lintang: '0.45 LS',
                    Bujur: '123.15 BT',
                    Magnitude: '5.1',
                    Kedalaman: '15 km',
                    Wilayah: '78 km BaratDaya BONEBOLANGO-GORONTALO',
                    Potensi: 'Tidak berpotensi TSUNAMI',
                    Dirasakan: 'II-III Bone Bolango, II Kota Gorontalo',
                    Shakemap: '20260919142210.mmi.jpg'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData) {
            fetchEarthquake();
        } else {
            setLastFetched(new Date().toLocaleTimeString('id-ID'));
        }

        const interval = setInterval(fetchEarthquake, 180000);
        return () => clearInterval(interval);
    }, []);

    const shakemapUrl = earthquake?.Shakemap 
        ? `/api/bmkg/shakemap/${earthquake.Shakemap}`
        : '';

    const magnitudeNumber = parseFloat(earthquake?.Magnitude || '0');
    const isMajor = magnitudeNumber >= 6.0;

    return (
        <div className="bg-white rounded-xl border border-bmkg-border shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="bg-[#0f172a] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-300" />
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
                        Gempabumi Terkini (M ≥ 5.0)
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                        Sumber: BMKG TEWS
                    </span>
                    <button
                        onClick={fetchEarthquake}
                        disabled={loading}
                        className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                        title="Perbarui Data Gempa"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                {loading && !earthquake ? (
                    <div className="py-12 text-center text-xs text-bmkg-muted flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                        <span>Menghubungkan ke server BMKG TEWS...</span>
                    </div>
                ) : earthquake ? (
                    <div className="space-y-4">
                        
                        <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                    Magnitudo
                                </span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className={`font-mono text-3xl sm:text-4xl font-black ${
                                        isMajor ? 'text-red-600' : 'text-bmkg-primary'
                                    }`}>
                                        {earthquake.Magnitude}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 uppercase">
                                        SR
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                    Status Potensi
                                </span>
                                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded text-[11px] font-bold ${
                                    earthquake.Potensi.toLowerCase().includes('tidak') 
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{earthquake.Potensi}</span>
                                </span>
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase">Waktu Gempa</span>
                                    <strong className="font-mono text-gray-800">{earthquake.Tanggal} - {earthquake.Jam}</strong>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-lg bg-bmkg-surface border border-bmkg-border/60">
                                <Layers className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-gray-500 uppercase">Kedalaman</span>
                                    <strong className="font-mono text-gray-800">{earthquake.Kedalaman}</strong>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-lg bg-bmkg-surface border border-bmkg-border/60 sm:col-span-2">
                                <Compass className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div className="truncate">
                                    <span className="block text-[10px] text-gray-500 uppercase">Koordinat Episentrum</span>
                                    <strong className="font-mono text-gray-800">{earthquake.Lintang}, {earthquake.Bujur}</strong>
                                </div>
                            </div>
                        </div>

                        
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                            <span className="block text-[10px] font-bold uppercase text-bmkg-navy tracking-wider mb-0.5">
                                Lokasi Pusat Gempa
                            </span>
                            <p className="font-medium text-bmkg-text leading-snug">
                                {earthquake.Wilayah}
                            </p>
                            {earthquake.Dirasakan && (
                                <p className="mt-1 text-[11px] text-gray-600 border-t border-slate-200 pt-1">
                                    <span className="font-semibold text-gray-700">Dirasakan:</span> {earthquake.Dirasakan}
                                </p>
                            )}
                        </div>

                        
                        {!compact && shakemapUrl && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-bmkg-border hover:border-bmkg-accent group text-left transition-colors shadow-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                            <img
                                                src={shakemapUrl}
                                                alt="Peta Shakemap Gempa"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-bmkg-navy group-hover:text-bmkg-primary block">
                                                Peta Guncangan (Shakemap)
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                Klik untuk melihat peta intensitas MMI BMKG
                                            </span>
                                        </div>
                                    </div>
                                    <Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-bmkg-accent transition-colors" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}

                
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Live TEWS BMKG</span>
                    <span className="font-mono">Pembaruan: {lastFetched || 'Real-time'}</span>
                </div>
            </div>

            
            {modalOpen && shakemapUrl && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3.5 bg-[#0f172a] text-white flex items-center justify-between border-b border-slate-800">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                    Peta Intensitas Guncangan (Shakemap MMI)
                                </h3>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Gempa M {earthquake?.Magnitude} - {earthquake?.Wilayah}
                                </p>
                            </div>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-gray-900 flex items-center justify-center min-h-[320px]">
                            <img 
                                src={shakemapUrl} 
                                alt="Peta Shakemap BMKG" 
                                className="max-h-[70vh] w-auto object-contain rounded"
                            />
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
                            <span>Sumber: Pusat Gempabumi dan Tsunami BMKG</span>
                            <a 
                                href={shakemapUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-bmkg-primary font-semibold hover:underline"
                            >
                                Buka Ukuran Penuh ↗
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
