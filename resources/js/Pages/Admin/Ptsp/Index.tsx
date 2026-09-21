import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Eye,
    Search,
    Filter,
    Coins,
    Building2,
    Calendar,
    Send
} from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo } from '@/Utils/formatters';

interface Ticket {
    id: number;
    ticket_number: string;
    applicant_name: string;
    institution: string;
    email: string;
    phone: string;
    purpose_category: string;
    data_requested: string;
    date_range: string;
    tariff_amount: string;
    is_free_education: boolean;
    status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
    admin_notes?: string;
    created_at: string;
    updated_at?: string;
    user?: {
        name: string;
    };
}

interface PtspProps {
    tickets: {
        data: Ticket[];
        links: PaginationLink[];
        from?: number;
        to?: number;
        total?: number;
    };
    currentFilter: string;
}

export default function PtspIndex({ tickets, currentFilter }: PtspProps) {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [newStatus, setNewStatus] = useState<string>('menunggu');
    const [adminNotes, setAdminNotes] = useState<string>('');
    const [tariff, setTariff] = useState<number>(0);
    const [processing, setProcessing] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedTicket(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleFilterChange = (status: string) => {
        router.get('/admin/ptsp', { status }, { preserveState: true });
    };

    const handleOpenDetail = (t: Ticket) => {
        setSelectedTicket(t);
        setNewStatus(t.status);
        setAdminNotes(t.admin_notes || '');
        setTariff(parseFloat(t.tariff_amount) || 0);
    };

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        setProcessing(true);
        router.put(`/admin/ptsp/${selectedTicket.id}/status`, {
            status: newStatus,
            admin_notes: adminNotes,
            tariff_amount: tariff,
        }, {
            onSuccess: () => {
                setProcessing(false);
                setSelectedTicket(null);
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout title="Manajemen Tiket Layanan PTSP">
            <Head title="Tiket Layanan PTSP - Admin BMKG" />

            <div className="space-y-6">

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Daftar Permohonan Data Klimatologi (PTSP Online)</h2>
                        <p className="text-xs text-slate-500">Verifikasi berkas persyaratan, status PNBP, dan penyiapan file data.</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: 'menunggu', label: 'Menunggu' },
                            { id: 'diproses', label: 'Diproses' },
                            { id: 'selesai', label: 'Selesai' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleFilterChange(tab.id)}
                                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${currentFilter === tab.id
                                    ? 'bg-white text-bmkg-primary shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">No. Tiket</th>
                                    <th className="py-3 px-4">Pemohon & Instansi</th>
                                    <th className="py-3 px-4">Kategori Layanan</th>
                                    <th className="py-3 px-4">Tarif PNBP</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Petugas</th>
                                    <th className="py-3 px-4">Waktu Masuk</th>
                                    <th className="py-3 px-4">Terakhir Diperbarui</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-slate-400">
                                            Tidak ada tiket dengan filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.data.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-mono font-bold text-bmkg-primary">{t.ticket_number}</td>
                                            <td className="py-3 px-4">
                                                <p className="font-bold text-slate-800">{t.applicant_name}</p>
                                                <p className="text-[11px] text-slate-500">{t.institution}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-slate-700 text-[11px] line-clamp-1">{t.purpose_category}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono">
                                                <span className="text-slate-800 font-bold">
                                                    {t.is_free_education && parseInt(t.tariff_amount).toLocaleString('id-ID') == "0" ? (
                                                        <span className='text-green-600'>Rp 0 (Riset)</span>
                                                    ) : (
                                                        <>Rp {parseInt(t.tariff_amount).toLocaleString('id-ID')}</>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase ${t.status === 'menunggu' ? 'bg-amber-100 text-amber-800' :
                                                    t.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                                                        t.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-700 font-medium">
                                                {t.user?.name || '-'}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {formatWaktuIndo(t.created_at)}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                                {formatWaktuIndo(t.updated_at)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => handleOpenDetail(t)}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-bmkg-primary hover:text-white text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Detail</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={tickets.links}
                        from={tickets.from}
                        to={tickets.to}
                        total={tickets.total}
                    />
                </div>


                {selectedTicket && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <span className="font-mono font-bold text-xs text-bmkg-primary">{selectedTicket.ticket_number}</span>
                                    <h3 className="text-sm font-bold text-slate-800">Detail Permohonan Data PTSP</h3>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>

                            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Pemohon</span>
                                        <strong className="text-slate-800">{selectedTicket.applicant_name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Instansi / Universitas</span>
                                        <strong className="text-slate-800">{selectedTicket.institution}</strong>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                                        <span className="text-slate-700">{selectedTicket.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Telepon / WA</span>
                                        <span className="text-slate-700">{selectedTicket.phone}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200/60">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Rincian Data yang Diminta</span>
                                    <p className="text-slate-800 font-medium mt-0.5">{selectedTicket.data_requested}</p>
                                    {selectedTicket.date_range && (
                                        <span className="text-[11px] text-slate-500 mt-1 block">Rentang Waktu: {selectedTicket.date_range}</span>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Status Pengerjaan</label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                                        >
                                            <option value="menunggu">Menunggu Verifikasi</option>
                                            <option value="diproses">Sedang Diproses Staf</option>
                                            <option value="selesai">Selesai / Data Dikirim</option>
                                            <option value="ditolak">Ditolak / Berkas Tidak Lengkap</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Penetapan Tarif PNBP (Rp)</label>
                                        <input
                                            type="number"
                                            value={tariff}
                                            onChange={(e) => setTariff(parseFloat(e.target.value) || 0)}
                                            className="w-full text-xs rounded-lg border-slate-300 font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Petugas / Tindak Lanjut</label>
                                    <textarea
                                        rows={3}
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="w-full text-xs rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                                        placeholder="Masukkan catatan petugas, keterangan verifikasi berkas, atau nomor resi pengiriman data"
                                    />
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTicket(null)}
                                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                                    >
                                        Tutup
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Perbarui Status Tiket'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
