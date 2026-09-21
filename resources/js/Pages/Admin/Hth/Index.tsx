import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CloudRain, Save, Filter, RefreshCw, CheckCircle2, Edit2 } from 'lucide-react';
import { formatWaktuIndo } from '@/Utils/formatters';

interface HthItem {
    id: number;
    region_name: string;
    district_name: string;
    days_without_rain: number;
    risk_category: string;
    status_label: string;
    dasarian: string;
    month: string;
    year: number;
    user?: {
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

interface HthProps {
    hthList: HthItem[];
    filters: {
        dasarian: string;
        month: string;
        year: number;
    };
}

export default function HthIndex({ hthList, filters }: HthProps) {
    const [selectedDasarian, setSelectedDasarian] = useState(filters.dasarian);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDays, setEditDays] = useState<number>(0);

    const handleFilter = (dasarian: string, month: string) => {
        setSelectedDasarian(dasarian);
        setSelectedMonth(month);
        router.get('/admin/hth', { dasarian, month, year: filters.year }, { preserveState: true });
    };

    const handleStartEdit = (item: HthItem) => {
        setEditingId(item.id);
        setEditDays(item.days_without_rain);
    };

    const handleSaveInline = (id: number) => {
        router.put(`/admin/hth/${id}`, {
            days_without_rain: editDays,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null)
        });
    };

    return (
        <AuthenticatedLayout title="Monitoring Hari Tanpa Hujan (HTH)">
            <Head title="Manajemen Data HTH - Admin BMKG" />

            <div className="space-y-6">
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Periode Pengamatan Dasarian</h2>
                        <p className="text-xs text-slate-500">Pilih periode dasarian dan bulan untuk menampilkan atau memperbarui data.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedDasarian}
                            onChange={(e) => handleFilter(e.target.value, selectedMonth)}
                            className="text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary py-1.5"
                        >
                            <option value="I">Dasarian I (Tgl 1 - 10)</option>
                            <option value="II">Dasarian II (Tgl 11 - 20)</option>
                            <option value="III">Dasarian III (Tgl 21 - Akhir Bulan)</option>
                        </select>

                        <select
                            value={selectedMonth}
                            onChange={(e) => handleFilter(selectedDasarian, e.target.value)}
                            className="text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary py-1.5"
                        >
                            {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-slate-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Daftar Hari Tanpa Hujan ({selectedDasarian} - {selectedMonth} {filters.year})
                            </h3>
                        </div>
                        <span className="text-xs text-slate-400">
                            Total {hthList.length} Kecamatan/Daerah
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Wilayah / Kabupaten</th>
                                    <th className="py-3 px-4">Kecamatan</th>
                                    <th className="py-3 px-4 text-center">Hari Tanpa Hujan</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Diinput Oleh</th>
                                    <th className="py-3 px-4">Waktu Dibuat</th>
                                    <th className="py-3 px-4">Terakhir Diperbarui</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {hthList.map((item) => {
                                    const isEditing = editingId === item.id;
                                    const isWarning = item.days_without_rain > 10;

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-bold text-slate-700">{item.region_name}</td>
                                            <td className="py-3 px-4 font-medium text-slate-800">{item.district_name}</td>
                                            <td className="py-3 px-4 text-center">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="365"
                                                            value={editDays}
                                                            onChange={(e) => setEditDays(parseInt(e.target.value) || 0)}
                                                            className="w-16 text-center text-xs font-mono font-bold rounded border-slate-300 py-1"
                                                            autoFocus
                                                        />
                                                        <span className="text-xs text-slate-500">Hari</span>
                                                    </div>
                                                ) : (
                                                    <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded inline-block ${
                                                        item.days_without_rain <= 5 ? 'bg-emerald-100 text-emerald-800' :
                                                        item.days_without_rain <= 10 ? 'bg-amber-100 text-amber-800' :
                                                        item.days_without_rain <= 20 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.days_without_rain} Hari
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-slate-700">{item.risk_category}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-slate-500 text-[11px]">{item.status_label}</span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-700 font-medium">
                                                {item.user?.name || 'Staf BMKG'}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {formatWaktuIndo(item.created_at)}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {formatWaktuIndo(item.updated_at)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleSaveInline(item.id)}
                                                            className="px-2.5 py-1 rounded bg-bmkg-primary text-white font-semibold text-[11px] hover:bg-bmkg-dark"
                                                        >
                                                            Simpan
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[11px] hover:bg-slate-300"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStartEdit(item)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-bmkg-primary hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        <span className="text-[11px]">Ubah</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
