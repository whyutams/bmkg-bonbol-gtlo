import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    Activity, 
    Plus, 
    Search, 
    Calendar, 
    Trash2, 
    Edit, 
    Eye, 
    AlertCircle, 
    CheckCircle2, 
    Layers, 
    Compass, 
    Upload, 
    Clock, 
    X, 
    FileText,
    ShieldCheck,
    Radio
} from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo, getWitaDateTimeLocal } from '@/Utils/formatters';

interface LocalEarthquakeItem {
    id: number;
    event_time: string;
    magnitude: number;
    depth_km: number;
    latitude: string;
    longitude: string;
    epicenter_location: string;
    felt_scale_mmi?: string | null;
    tsunami_potential: string;
    shakemap_image?: string | null;
    notes?: string | null;
    is_published: boolean;
    creator?: {
        id: number;
        name: string;
        role: string;
    };
    updater?: {
        id: number;
        name: string;
        role: string;
    } | null;
    created_at?: string;
    updated_at?: string;
}

interface PaginatedEarthquakes {
    data: LocalEarthquakeItem[];
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    current_page?: number;
    last_page?: number;
}

interface Props {
    earthquakes: PaginatedEarthquakes;
    filters: {
        search?: string;
    };
    stats: {
        total: number;
        this_month: number;
        felt_count: number;
    };
}

export default function LocalEarthquakesIndex({ earthquakes, filters, stats }: Props) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'staf';
    const canDelete = userRole === 'superadmin' || userRole === 'admin';

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<LocalEarthquakeItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<LocalEarthquakeItem | null>(null);
    const [search, setSearch] = useState<string>(filters.search || '');

    // Form Tambah
    const { data: addData, setData: setAddData, post: postAdd, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm({
        event_time: getWitaDateTimeLocal(),
        magnitude: '',
        depth_km: '',
        latitude: '',
        longitude: '',
        epicenter_location: '',
        felt_scale_mmi: '',
        tsunami_potential: 'Tidak Berpotensi TSUNAMI',
        shakemap_image: null as File | null,
        notes: '',
        is_published: true,
    });

    // Form Edit
    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        _method: 'PUT',
        event_time: '',
        magnitude: '',
        depth_km: '',
        latitude: '',
        longitude: '',
        epicenter_location: '',
        felt_scale_mmi: '',
        tsunami_potential: 'Tidak Berpotensi TSUNAMI',
        shakemap_image: null as File | null,
        notes: '',
        is_published: true,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setAddModalOpen(false);
                setEditModalOpen(false);
                setDetailModalOpen(false);
                setDeleteModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.local-earthquakes.index'), { search }, { preserveState: true });
    };

    const handleOpenEdit = (item: LocalEarthquakeItem) => {
        setSelectedItem(item);
        const formattedLocal = getWitaDateTimeLocal(new Date(item.event_time));

        setEditData({
            _method: 'PUT',
            event_time: formattedLocal,
            magnitude: String(item.magnitude),
            depth_km: String(item.depth_km),
            latitude: item.latitude,
            longitude: item.longitude,
            epicenter_location: item.epicenter_location,
            felt_scale_mmi: item.felt_scale_mmi || '',
            tsunami_potential: item.tsunami_potential,
            shakemap_image: null,
            notes: item.notes || '',
            is_published: item.is_published,
        });
        setEditModalOpen(true);
    };

    const handleOpenDetail = (item: LocalEarthquakeItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    const handleOpenDelete = (item: LocalEarthquakeItem) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleOpenAdd = () => {
        resetAdd();
        setAddData({
            event_time: getWitaDateTimeLocal(),
            magnitude: '',
            depth_km: '',
            latitude: '',
            longitude: '',
            epicenter_location: '',
            felt_scale_mmi: '',
            tsunami_potential: 'Tidak Berpotensi TSUNAMI',
            shakemap_image: null,
            notes: '',
            is_published: true,
        });
        setAddModalOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd(route('admin.local-earthquakes.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setAddModalOpen(false);
                resetAdd();
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        postEdit(route('admin.local-earthquakes.update', selectedItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditModalOpen(false);
                resetEdit();
            }
        });
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        router.delete(route('admin.local-earthquakes.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setItemToDelete(null);
            }
        });
    };

    const getMagnitudeBadge = (mag: number) => {
        if (mag >= 5.0) {
            return 'bg-red-50 text-red-700 border-red-200';
        } else if (mag >= 3.0) {
            return 'bg-amber-50 text-amber-700 border-amber-200';
        }
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    };

    return (
        <AuthenticatedLayout header="Manajemen Data Gempabumi Lokal Gorontalo & Bone Bolango">
            <Head title="Data Gempabumi Lokal - Staklim BMKG Bone Bolango" />

            <div className="space-y-6">
                
                {/* Header Page & Action */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-slate-800">
                            <Activity className="w-5 h-5 text-bmkg-primary" />
                            <h2 className="text-base font-bold text-slate-900">
                                Katalog Seismik Lokal Gorontalo & Bone Bolango
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Pencatatan dan pengelolaan data gempa tektonik lokal (Sesar Gorontalo, Teluk Tomini, dan sesar dangkal daratan) untuk diseminasi publik.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAdd}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-bmkg-primary hover:bg-bmkg-dark text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Input Gempa Lokal Baru</span>
                    </button>
                </div>

                {/* Metrik Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Terkatalog</span>
                            <span className="text-2xl font-black font-mono text-slate-800">{stats.total}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Peristiwa gempa lokal</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Radio className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bulan Berjalan</span>
                            <span className="text-2xl font-black font-mono text-emerald-600">{stats.this_month}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Periode bulan aktif</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gempa Dirasakan</span>
                            <span className="text-2xl font-black font-mono text-amber-600">{stats.felt_count}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Skala II MMI atau lebih</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filter & Pencarian */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari wilayah, skala MMI, atau catatan..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 outline-none focus:bg-white focus:border-bmkg-primary"
                        />
                    </form>

                    <div className="text-[11px] text-slate-500 font-medium">
                        Menampilkan <strong>{earthquakes.data.length}</strong> dari <strong>{earthquakes.total || 0}</strong> rekaman gempa lokal.
                    </div>
                </div>

                {/* Tabel Data Gempa Lokal */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                                    <th className="py-3 px-3.5">No</th>
                                    <th className="py-3 px-3.5">Waktu Kejadian (WITA)</th>
                                    <th className="py-3 px-3.5 text-center">Mag</th>
                                    <th className="py-3 px-3.5">Kedalaman</th>
                                    <th className="py-3 px-3.5">Koordinat</th>
                                    <th className="py-3 px-3.5">Pusat Episentrum</th>
                                    <th className="py-3 px-3.5">Dirasakan (MMI)</th>
                                    <th className="py-3 px-3.5">Diinput Oleh</th>
                                    <th className="py-3 px-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {earthquakes.data.length > 0 ? (
                                    earthquakes.data.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-3.5 text-slate-400 font-mono">
                                                {(earthquakes.from || 1) + idx}
                                            </td>
                                            <td className="py-3 px-3.5 font-mono text-slate-800 whitespace-nowrap">
                                                {formatWaktuIndo(item.event_time)}
                                            </td>
                                            <td className="py-3 px-3.5 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs border ${getMagnitudeBadge(item.magnitude)}`}>
                                                    {item.magnitude}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3.5 font-mono text-slate-700 whitespace-nowrap">
                                                {item.depth_km} km
                                            </td>
                                            <td className="py-3 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                                                {item.latitude}, {item.longitude}
                                            </td>
                                            <td className="py-3 px-3.5 text-slate-800 font-medium max-w-xs">
                                                {item.epicenter_location}
                                            </td>
                                            <td className="py-3 px-3.5">
                                                {item.felt_scale_mmi ? (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                        {item.felt_scale_mmi}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">Tidak dirasakan</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                                                <span className="font-semibold block text-slate-800">{item.creator?.name || 'Staf BMKG'}</span>
                                                <span className="text-[10px] text-slate-400 block">{formatWaktuIndo(item.created_at)}</span>
                                            </td>
                                            <td className="py-3 px-3.5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenDetail(item)}
                                                        title="Lihat Detail & Shakemap"
                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        title="Edit Parameter Gempa"
                                                        className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleOpenDelete(item)}
                                                            title="Hapus Data Gempa"
                                                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                                            Belum ada data gempabumi lokal yang tercatat atau cocok dengan pencarian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {earthquakes.links && earthquakes.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                            <Pagination links={earthquakes.links} />
                        </div>
                    )}
                </div>

                {/* MODAL TAMBAH GEMPA LOKAL */}
                {addModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-bmkg-primary" />
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Input Data Gempabumi Lokal Baru
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setAddModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block font-bold text-slate-700">
                                                Waktu Kejadian (WITA) <span className="text-red-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setAddData('event_time', getWitaDateTimeLocal())}
                                                className="text-[10px] text-bmkg-primary hover:underline font-semibold"
                                                title="Gunakan waktu WITA sekarang"
                                            >
                                                Waktu Sekarang (WITA)
                                            </button>
                                        </div>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={addData.event_time}
                                            onChange={(e) => setAddData('event_time', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                        {addErrors.event_time && <span className="text-red-500 text-[10px] mt-0.5 block">{addErrors.event_time}</span>}
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Magnitudo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="10.0"
                                            required
                                            value={addData.magnitude}
                                            onChange={(e) => setAddData('magnitude', e.target.value)}
                                            placeholder="Masukkan nilai magnitudo (misal: 3.6)"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                        {addErrors.magnitude && <span className="text-red-500 text-[10px] mt-0.5 block">{addErrors.magnitude}</span>}
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Kedalaman (km) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            required
                                            value={addData.depth_km}
                                            onChange={(e) => setAddData('depth_km', e.target.value)}
                                            placeholder="Masukkan kedalaman (misal: 10)"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                        {addErrors.depth_km && <span className="text-red-500 text-[10px] mt-0.5 block">{addErrors.depth_km}</span>}
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Titik Koordinat (Lintang & Bujur) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <input
                                                type="text"
                                                required
                                                value={addData.latitude}
                                                onChange={(e) => setAddData('latitude', e.target.value)}
                                                placeholder="Lintang (0.52 LU)"
                                                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                            />
                                            <input
                                                type="text"
                                                required
                                                value={addData.longitude}
                                                onChange={(e) => setAddData('longitude', e.target.value)}
                                                placeholder="Bujur (123.18 BT)"
                                                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Deskripsi Pusat Episentrum <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addData.epicenter_location}
                                        onChange={(e) => setAddData('epicenter_location', e.target.value)}
                                        placeholder="Masukkan narasi lokasi episentrum (contoh: 12 km Tenggara Suwawa, Bone Bolango)"
                                        className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                    />
                                    {addErrors.epicenter_location && <span className="text-red-500 text-[10px] mt-0.5 block">{addErrors.epicenter_location}</span>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Skala Intensitas Dirasakan (MMI)
                                        </label>
                                        <input
                                            type="text"
                                            value={addData.felt_scale_mmi}
                                            onChange={(e) => setAddData('felt_scale_mmi', e.target.value)}
                                            placeholder="Masukkan skala MMI (contoh: II - III MMI Suwawa)"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Keterangan Potensi Tsunami
                                        </label>
                                        <select
                                            value={addData.tsunami_potential}
                                            onChange={(e) => setAddData('tsunami_potential', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        >
                                            <option value="Tidak Berpotensi TSUNAMI">Tidak Berpotensi TSUNAMI</option>
                                            <option value="Berpotensi TSUNAMI">Berpotensi TSUNAMI</option>
                                            <option value="Peringatan Dini Tsunami Diteruskan">Peringatan Dini Tsunami Diteruskan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Upload Gambar Peta Shakemap / Episentrum (Maks 4MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) => setAddData('shakemap_image', e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                                    />
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Format didukung: PNG, JPG, JPEG, WEBP. Maksimal 4 MB.</span>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Catatan Tektonik & Seismologis
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={addData.notes}
                                        onChange={(e) => setAddData('notes', e.target.value)}
                                        placeholder="Masukkan analisis penyebab gempa (misal: aktivitas segmen lokal Sesar Gorontalo)..."
                                        className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-bmkg-primary"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setAddModalOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addProcessing}
                                        className="px-5 py-2 text-xs font-bold bg-bmkg-primary hover:bg-bmkg-dark text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {addProcessing ? 'Menyimpan...' : 'Simpan Data Gempa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL EDIT GEMPA LOKAL */}
                {editModalOpen && selectedItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Edit className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Edit Parameter Gempabumi Lokal #{selectedItem.id}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setEditModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block font-bold text-slate-700">
                                                Waktu Kejadian (WITA) <span className="text-red-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setEditData('event_time', getWitaDateTimeLocal())}
                                                className="text-[10px] text-bmkg-primary hover:underline font-semibold"
                                                title="Gunakan waktu WITA sekarang"
                                            >
                                                Waktu Sekarang (WITA)
                                            </button>
                                        </div>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={editData.event_time}
                                            onChange={(e) => setEditData('event_time', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Magnitudo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="10.0"
                                            required
                                            value={editData.magnitude}
                                            onChange={(e) => setEditData('magnitude', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Kedalaman (km) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            required
                                            value={editData.depth_km}
                                            onChange={(e) => setEditData('depth_km', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Koordinat (Lintang & Bujur) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <input
                                                type="text"
                                                required
                                                value={editData.latitude}
                                                onChange={(e) => setEditData('latitude', e.target.value)}
                                                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                            />
                                            <input
                                                type="text"
                                                required
                                                value={editData.longitude}
                                                onChange={(e) => setEditData('longitude', e.target.value)}
                                                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Deskripsi Pusat Episentrum <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editData.epicenter_location}
                                        onChange={(e) => setEditData('epicenter_location', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Skala Intensitas Dirasakan (MMI)
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.felt_scale_mmi}
                                            onChange={(e) => setEditData('felt_scale_mmi', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Potensi Tsunami
                                        </label>
                                        <select
                                            value={editData.tsunami_potential}
                                            onChange={(e) => setEditData('tsunami_potential', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        >
                                            <option value="Tidak Berpotensi TSUNAMI">Tidak Berpotensi TSUNAMI</option>
                                            <option value="Berpotensi TSUNAMI">Berpotensi TSUNAMI</option>
                                            <option value="Peringatan Dini Tsunami Diteruskan">Peringatan Dini Tsunami Diteruskan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Perbarui Gambar Shakemap (Opsional, Maks 4MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) => setEditData('shakemap_image', e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                                    />
                                    {selectedItem.shakemap_image && (
                                        <span className="text-[10px] text-emerald-600 block mt-1">
                                            ✓ File gambar shakemap saat ini tersimpan di sistem.
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Catatan Tektonik & Seismologis
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={editData.notes}
                                        onChange={(e) => setEditData('notes', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-bmkg-primary"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditModalOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {editProcessing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL LIHAT DETAIL & SHAKEMAP */}
                {detailModalOpen && selectedItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-bmkg-primary" />
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Detail Seismisitas Gempa #{selectedItem.id}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setDetailModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                                <div className="flex items-baseline justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-slate-500">Magnitudo:</span>
                                    <strong className="text-lg font-mono text-bmkg-primary">{selectedItem.magnitude} SR</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Waktu Kejadian (WITA):</span>
                                    <strong className="font-mono text-slate-800">{formatWaktuIndo(selectedItem.event_time)}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Kedalaman:</span>
                                    <strong className="font-mono text-slate-800">{selectedItem.depth_km} km</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Koordinat Episentrum:</span>
                                    <strong className="font-mono text-slate-800">{selectedItem.latitude}, {selectedItem.longitude}</strong>
                                </div>
                                <div className="border-t border-slate-200/60 pt-2">
                                    <span className="text-slate-500 block mb-0.5">Lokasi Pusat Gempa:</span>
                                    <p className="font-bold text-slate-800 leading-snug">{selectedItem.epicenter_location}</p>
                                </div>
                                {selectedItem.felt_scale_mmi && (
                                    <div className="border-t border-slate-200/60 pt-2">
                                        <span className="text-slate-500 block mb-0.5">Dampak Getaran Dirasakan:</span>
                                        <p className="font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">{selectedItem.felt_scale_mmi}</p>
                                    </div>
                                )}
                                {selectedItem.notes && (
                                    <div className="border-t border-slate-200/60 pt-2">
                                        <span className="text-slate-500 block mb-0.5">Catatan Tektonik:</span>
                                        <p className="text-slate-700 italic">{selectedItem.notes}</p>
                                    </div>
                                )}
                            </div>

                            {selectedItem.shakemap_image ? (
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-slate-600 block">Peta Guncangan (Shakemap) Terlampir:</span>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-64">
                                        <img 
                                            src={`/storage/${selectedItem.shakemap_image}`} 
                                            alt="Peta Shakemap Lokal" 
                                            className="w-full h-auto object-contain max-h-64"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center text-[11px] text-slate-400">
                                    Tidak ada berkas gambar shakemap yang diunggah untuk peristiwa ini.
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={() => setDetailModalOpen(false)}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                    Tutup Detail
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL KONFIRMASI HAPUS */}
                {deleteModalOpen && itemToDelete && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 text-center animate-in zoom-in-95 duration-200">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">
                                    Hapus Data Gempa Lokal?
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Apakah Anda yakin ingin menghapus data gempa <strong>M {itemToDelete.magnitude}</strong> di <em>{itemToDelete.epicenter_location}</em>? Tindakan ini akan dicatat di audit log sistem.
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                                >
                                    Ya, Hapus Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

