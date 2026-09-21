import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';

interface PosStation {
    id: number;
    name: string;
    code: string;
    district: string;
    type: 'OBS' | 'HELLMAN' | 'AWS' | 'ARG';
    latitude: number;
    longitude: number;
    elevation: number;
    status: 'aktif' | 'kalibrasi' | 'rusak';
    address?: string;
    pic_name?: string;
    pic_phone?: string;
    creator?: {
        id: number;
        name: string;
        username?: string;
    };
    created_at?: string;
    updated_at?: string;
}

interface PosHujanProps {
    stations: {
        data: PosStation[];
        links: PaginationLink[];
        from?: number;
        to?: number;
        total?: number;
    };
}

interface PosHujanFormData {
    name: string;
    code: string;
    district: string;
    type: 'OBS' | 'HELLMAN' | 'AWS' | 'ARG';
    latitude: number;
    longitude: number;
    elevation: number;
    status: 'aktif' | 'kalibrasi' | 'rusak';
    address: string;
    pic_name: string;
    pic_phone: string;
}

const formatWaktuIndo = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};

export default function PosHujanIndex({ stations }: PosHujanProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState<PosStation | null>(null);
    const [editingStation, setEditingStation] = useState<PosStation | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm<PosHujanFormData>({
        name: '',
        code: '',
        district: 'Suwawa',
        type: 'OBS',
        latitude: 0.5583,
        longitude: 123.0551,
        elevation: 25,
        status: 'aktif',
        address: '',
        pic_name: '',
        pic_phone: ''
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalOpen(false);
                setDeleteModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOpenCreate = () => {
        setEditingStation(null);
        reset();
        setModalOpen(true);
    };

    const handleOpenEdit = (s: PosStation) => {
        setEditingStation(s);
        setData({
            name: s.name,
            code: s.code,
            district: s.district,
            type: s.type,
            latitude: s.latitude,
            longitude: s.longitude,
            elevation: s.elevation,
            status: s.status,
            address: s.address || '',
            pic_name: s.pic_name || '',
            pic_phone: s.pic_phone || ''
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStation) {
            put(`/admin/pos-hujan/${editingStation.id}`, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false)
            });
        } else {
            post('/admin/pos-hujan', {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false)
            });
        }
    };

    const handleOpenDelete = (s: PosStation) => {
        setStationToDelete(s);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!stationToDelete) return;
        router.delete(`/admin/pos-hujan/${stationToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteModalOpen(false)
        });
    };

    const filtered = stations.data.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.district.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout title="Manajemen Jaringan Pos Hujan (GIS)">
            <Head title="Jaringan Pos Hujan - Admin BMKG" />

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Inventaris Titik Pos Pengamatan Hujan</h2>
                        <p className="text-xs text-slate-500">Data pos ini akan tersinkronisasi langsung pada peta interaktif Leaflet di halaman `/profil`.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-60">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama pos / kecamatan..."
                                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold flex items-center gap-2 transition-colors flex-shrink-0 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Pos Baru</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Nama Pos & Kode</th>
                                    <th className="py-3 px-4">Kecamatan</th>
                                    <th className="py-3 px-4">Tipe Alat</th>
                                    <th className="py-3 px-4 font-mono">Koordinat (Lat / Long)</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Diinput Oleh</th>
                                    <th className="py-3 px-4">Waktu Dibuat</th>
                                    <th className="py-3 px-4">Terakhir Diperbarui</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-bold text-slate-800">{s.name}</p>
                                            <p className="font-mono text-[11px] text-slate-400">{s.code}</p>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-700">{s.district}</td>
                                        <td className="py-3 px-4">
                                            <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold">
                                                {s.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-slate-600">
                                            {s.latitude}, {s.longitude} ({s.elevation} mdpl)
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                s.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                                                s.status === 'kalibrasi' ? 'bg-amber-100 text-amber-800' :
                                                'bg-rose-100 text-rose-800'
                                            }`}>
                                                {s.status === 'aktif' && <CheckCircle2 className="w-3 h-3" />}
                                                {s.status === 'kalibrasi' && <AlertTriangle className="w-3 h-3" />}
                                                {s.status === 'rusak' && <XCircle className="w-3 h-3" />}
                                                <span>{s.status}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 font-medium">
                                            {s.creator?.name || 'Staf BMKG'}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                            {formatWaktuIndo(s.created_at)}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                            {formatWaktuIndo(s.updated_at)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(s)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-bmkg-primary hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Edit Data Pos"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(s)}
                                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Hapus Titik Pos"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={stations.links}
                        from={stations.from}
                        to={stations.to}
                        total={stations.total}
                    />
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800">
                                    {editingStation ? 'Edit Data Titik Pos Hujan' : 'Tambah Titik Pos Hujan Baru'}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nama Pos Pengamatan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama pos pengamatan"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                        />
                                        {errors.name && <p className="text-red-600 text-[11px] mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Kode Resmi Pos <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Masukkan kode pos (misal: PS-TGL-01)"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none font-mono"
                                        />
                                        {errors.code && <p className="text-red-600 text-[11px] mt-1">{errors.code}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Kecamatan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.district}
                                            onChange={(e) => setData('district', e.target.value)}
                                            placeholder="Masukkan nama kecamatan"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Tipe Penakar / Sensor <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as any)}
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none bg-white"
                                        >
                                            <option value="OBS">OBS (Manual Observatorium)</option>
                                            <option value="HELLMAN">Hellman (Otomatis Mekanik)</option>
                                            <option value="ARG">ARG (Automatic Rain Gauge)</option>
                                            <option value="AWS">AWS (Automatic Weather Station)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Status Alat <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as any)}
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none bg-white"
                                        >
                                            <option value="aktif">Aktif Normal</option>
                                            <option value="kalibrasi">Tahap Kalibrasi</option>
                                            <option value="rusak">Rusak / Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Latitude (Garis Lintang) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            required
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', parseFloat(e.target.value))}
                                            placeholder="Misal: 0.5583"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Longitude (Garis Bujur) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            required
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', parseFloat(e.target.value))}
                                            placeholder="Misal: 123.0551"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Elevasi (mdpl)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.elevation}
                                            onChange={(e) => setData('elevation', parseInt(e.target.value) || 0)}
                                            placeholder="Misal: 25"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Alamat Lokasi Pemasangan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Masukkan alamat lengkap lokasi penakar hujan..."
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nama Petugas PIC / Observer
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pic_name}
                                            onChange={(e) => setData('pic_name', e.target.value)}
                                            placeholder="Masukkan nama petugas pengamat"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nomor Telepon Petugas PIC
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pic_phone}
                                            onChange={(e) => setData('pic_phone', e.target.value)}
                                            placeholder="Masukkan nomor telepon petugas"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Menyimpan...' : editingStation ? 'Simpan Perubahan' : 'Tambah Titik Pos'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteModalOpen && stationToDelete && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-base font-bold text-slate-800">Konfirmasi Hapus Pos Hujan</h3>
                                <p className="text-xs text-slate-500">
                                    Apakah Anda yakin ingin menghapus pos hujan <strong>"{stationToDelete.name}"</strong> ({stationToDelete.code})?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
