import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AlertTriangle, ShieldCheck, AlertCircle, AlertOctagon, Save, History, CheckCircle2 } from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo } from '@/Utils/formatters';

interface WarningProps {
    currentWarning?: {
        id: number;
        level: 'normal' | 'waspada' | 'siaga' | 'awas';
        title: string;
        description: string;
        affected_areas: string[];
        valid_until: string;
        issued_at: string;
    };
    history: {
        data: Array<{
            id: number;
            level: string;
            title: string;
            issued_at: string;
            valid_until: string;
            user?: { name: string };
            created_at?: string;
            updated_at?: string;
        }>;
        links: PaginationLink[];
        from?: number;
        to?: number;
        total?: number;
    };
}

export default function WarningIndex({ currentWarning, history }: WarningProps) {
    const { data, setData, post, processing, errors } = useForm({
        level: currentWarning?.level || 'normal',
        title: currentWarning?.title || 'Status Cuaca Normal - Tidak Ada Peringatan Dini Ekstrem',
        description: currentWarning?.description || 'Kondisi atmosfer di wilayah Kabupaten Bone Bolango dan sekitarnya terpantau kondusif. Tetap pantau pembaruan berkala dari BMKG.',
        valid_until: currentWarning?.valid_until || '24 Jam ke Depan',
        affected_areas: currentWarning?.affected_areas || ['Kabupaten Bone Bolango', 'Kota Gorontalo'],
    });

    const presetDescriptions = {
        normal: {
            title: 'Status Cuaca Normal - Tidak Ada Peringatan Dini Ekstrem',
            desc: 'Kondisi atmosfer di wilayah Kabupaten Bone Bolango dan sekitarnya terpantau kondusif. Tetap pantau pembaruan berkala dari BMKG.',
        },
        waspada: {
            title: 'Waspada Potensi Hujan Sedang hingga Lebat Disertai Kilat / Petir',
            desc: 'Masyarakat di wilayah lereng bukit dan bantaran sungai diimbau berhati-hati terhadap genangan air lokal dan jarak pandang berkurang.',
        },
        siaga: {
            title: 'Siaga Cuaca Ekstrem - Potensi Hujan Lebat dan Angin Kencang',
            desc: 'Waspada potensi banjir luapan DAS Bone Bolango dan pohon tumbang. Hindari aktivitas di ruang terbuka saat petir terjadi.',
        },
        awas: {
            title: 'Peringatan Dini Status Awas - Bahaya Banjir Bandang dan Longsor',
            desc: 'Segera lakukan evakuasi mandiri bagi warga di zona rawan longsor dan bantaran sungai utama. Koordinasi aktif dengan BPBD Kabupaten Bone Bolango.',
        }
    };

    const handleLevelChange = (level: 'normal' | 'waspada' | 'siaga' | 'awas') => {
        setData(prev => ({
            ...prev,
            level,
            title: presetDescriptions[level].title,
            description: presetDescriptions[level].desc,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/warnings');
    };

    return (
        <AuthenticatedLayout title="Manajemen Peringatan Dini (EWS)">
            <Head title="Peringatan Dini Cuaca - Admin BMKG" />

            <div className="space-y-6 w-full">
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Status Peringatan Dini Cuaca Ekstrem (EWS Banner)</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Status yang dipilih akan langsung tampil di banner utama halaman depan portal publik.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Tingkat Status Bahaya
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { id: 'normal', label: 'Normal / Aman', icon: ShieldCheck, color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                                    { id: 'waspada', label: 'Waspada (Kuning)', icon: AlertTriangle, color: 'border-amber-500 bg-amber-50 text-amber-800' },
                                    { id: 'siaga', label: 'Siaga (Oranye)', icon: AlertCircle, color: 'border-orange-500 bg-orange-50 text-orange-800' },
                                    { id: 'awas', label: 'Awas / Bahaya (Merah)', icon: AlertOctagon, color: 'border-red-500 bg-red-50 text-red-800' },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = data.level === item.id;
                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => handleLevelChange(item.id as any)}
                                            className={`
                                                p-3 rounded-xl border-2 flex flex-col items-center text-center gap-2 transition-all
                                                ${isSelected ? `${item.color} font-bold shadow-xs` : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-xs">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Judul Peringatan
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                                placeholder="Masukkan judul peringatan dini cuaca"
                            />
                            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                        </div>

                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Narasi & Imbauan Keselamatan
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                                placeholder="Masukkan detail narasi informasi dan imbauan keselamatan"
                            />
                            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                        </div>

                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Masa Berlaku
                            </label>
                            <input
                                type="text"
                                value={data.valid_until}
                                onChange={(e) => setData('valid_until', e.target.value)}
                                className="w-full text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                                placeholder="Masukkan masa berlaku peringatan (misal: 24 Jam ke Depan)"
                            />
                            {errors.valid_until && <p className="text-red-600 text-xs mt-1">{errors.valid_until}</p>}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan & Publikasikan ke Banner'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Riwayat Perubahan Status Peringatan Dini
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-2.5 px-4">Waktu Terbit</th>
                                    <th className="py-2.5 px-4">Status</th>
                                    <th className="py-2.5 px-4">Judul Peringatan</th>
                                    <th className="py-2.5 px-4">Diinput Oleh</th>
                                    <th className="py-2.5 px-4">Waktu Dibuat</th>
                                    <th className="py-2.5 px-4">Terakhir Diperbarui</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="py-2.5 px-4 font-mono text-slate-500">{item.issued_at}</td>
                                        <td className="py-2.5 px-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                item.level === 'normal' ? 'bg-emerald-100 text-emerald-800' :
                                                item.level === 'waspada' ? 'bg-amber-100 text-amber-800' :
                                                item.level === 'siaga' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {item.level}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 font-medium text-slate-800">{item.title}</td>
                                        <td className="py-2.5 px-4 text-slate-700 font-medium">{item.user?.name || 'Sistem'}</td>
                                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{formatWaktuIndo(item.created_at)}</td>
                                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{formatWaktuIndo(item.updated_at)}</td>
                                    </tr>
                                ))}
                                {history.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            Belum ada riwayat peringatan dini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-100">
                        <Pagination links={history.links} from={history.from} to={history.to} total={history.total} />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
