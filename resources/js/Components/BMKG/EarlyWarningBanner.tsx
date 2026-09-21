import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { WarningLevel, EarlyWarning } from '@/types/bmkg';

interface EarlyWarningBannerProps {
    warning?: EarlyWarning;
    dbWarning?: any;
}

export default function EarlyWarningBanner({ warning, dbWarning }: EarlyWarningBannerProps) {
    const rawData = dbWarning || warning;
    const defaultWarning: EarlyWarning = {
        level: 'normal',
        title: 'Status Cuaca Normal - Tidak Ada Peringatan Dini Ekstrem',
        description: 'Kondisi atmosfer di wilayah Kabupaten Bone Bolango dan sekitarnya terpantau kondusif. Tetap pantau pembaruan berkala dari BMKG.',
        issuedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' 07:00 WITA',
        validUntil: '24 Jam ke Depan',
        affectedAreas: ['Kabupaten Bone Bolango', 'Kota Gorontalo', 'Kabupaten Gorontalo']
    };

    const data: EarlyWarning = rawData ? {
        level: rawData.level || 'normal',
        title: rawData.title || defaultWarning.title,
        description: rawData.description || defaultWarning.description,
        issuedAt: rawData.issued_at || rawData.issuedAt || defaultWarning.issuedAt,
        validUntil: rawData.valid_until || rawData.validUntil || defaultWarning.validUntil,
        affectedAreas: rawData.affected_areas || rawData.affectedAreas || defaultWarning.affectedAreas,
    } : defaultWarning;

    const levelConfigs = {
        normal: {
            bg: 'bg-slate-50 border-slate-200 text-slate-900',
            badgeBg: 'bg-slate-800 text-white',
            borderAccent: 'border-l-slate-700',
            icon: ShieldCheck,
            label: 'STATUS NORMAL / KONDUSIF',
            iconColor: 'text-slate-600'
        },
        waspada: {
            bg: 'bg-amber-50 border-amber-300 text-amber-950',
            badgeBg: 'bg-amber-500 text-white',
            borderAccent: 'border-l-amber-500',
            icon: AlertTriangle,
            label: 'STATUS WASPADA',
            iconColor: 'text-amber-600'
        },
        siaga: {
            bg: 'bg-orange-50 border-orange-300 text-orange-950',
            badgeBg: 'bg-orange-600 text-white',
            borderAccent: 'border-l-orange-600',
            icon: AlertCircle,
            label: 'STATUS SIAGA',
            iconColor: 'text-orange-600'
        },
        awas: {
            bg: 'bg-red-50 border-red-300 text-red-950',
            badgeBg: 'bg-red-600 text-white',
            borderAccent: 'border-l-red-600',
            icon: AlertOctagon,
            label: 'STATUS AWAS - BAHAYA',
            iconColor: 'text-red-600'
        }
    };

    const config = levelConfigs[data.level] || levelConfigs.normal;
    const IconComponent = config.icon;

    return (
        <div className={`w-full rounded-xl border p-4 sm:p-5 shadow-sm border-l-4 ${config.bg} ${config.borderAccent} transition-all`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-white shadow-sm flex-shrink-0">
                        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${config.badgeBg}`}>
                                {config.label}
                            </span>
                            <span className="text-xs text-gray-500">
                                Berlaku: <strong>{data.validUntil}</strong>
                            </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                            {data.title}
                        </h3>
                        <p className="text-xs text-gray-700 mt-1 leading-relaxed max-w-4xl">
                            {data.description}
                        </p>
                    </div>
                </div>

                <div className="sm:text-right flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Pembaruan Terakhir</span>
                    <span className="font-mono text-xs font-bold text-gray-800">{data.issuedAt}</span>
                    <span className="block text-[10px] text-bmkg-muted mt-0.5">Sistem Peringatan Dini BMKG</span>
                </div>
            </div>
        </div>
    );
}
