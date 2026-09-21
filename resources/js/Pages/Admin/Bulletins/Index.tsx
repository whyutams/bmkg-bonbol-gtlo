import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    FileText, 
    Upload, 
    Trash2, 
    Download, 
    ExternalLink, 
    Plus, 
    Calendar, 
    Search,
    AlertCircle,
    Eye
} from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatTanggalIndo, formatWaktuIndo } from '@/Utils/formatters';

interface BulletinItem {
    id: number;
    title: string;
    edition: string;
    category: 'buletin' | 'peta' | 'laporan';
    file_size: string;
    file_type: string;
    download_url?: string;
    published_date: string;
    is_published: boolean;
    summary?: string;
    user?: {
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

interface PaginatedBulletins {
    data: BulletinItem[];
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
}

interface Props {
    bulletins: PaginatedBulletins;
}

export default function BulletinsIndex({ bulletins }: Props) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [bulletinToDelete, setBulletinToDelete] = useState<BulletinItem | null>(null);
    const [search, setSearch] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        edition: '',
        category: 'buletin' as 'buletin' | 'peta' | 'laporan',
        published_date: new Date().toISOString().split('T')[0],
        summary: '',
        file_pdf: null as File | null,
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

    const handleOpenDeleteModal = (b: BulletinItem) => {
        setBulletinToDelete(b);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!bulletinToDelete) return;
        router.delete(route('admin.bulletins.destroy', bulletinToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModalOpen(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.bulletins.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    const filtered = bulletins.data.filter(b => 
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.edition.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout title="Publikasi & Buletin Iklim BMKG">
            <Head title="Buletin & Publikasi Iklim - Admin BMKG" />

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Katalog Dokumen Buletin & Analisis Iklim</h2>
                        <p className="text-xs text-slate-500">Seluruh dokumen yang diunggah akan otomatis muncul pada menu Unduhan publik.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-60">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul atau edisi buletin..."
                                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            />
                        </div>
                        <button
                            onClick={() => { reset(); setModalOpen(true); }}
                            className="px-4 py-2 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold flex items-center gap-2 transition-colors flex-shrink-0 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Unggah Dokumen Baru</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Judul Dokumen Publikasi</th>
                                    <th className="py-3 px-4">Edisi</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">File</th>
                                    <th className="py-3 px-4">Tanggal Rilis</th>
                                    <th className="py-3 px-4">Diinput Oleh</th>
                                    <th className="py-3 px-4">Waktu Dibuat</th>
                                    <th className="py-3 px-4">Terakhir Diperbarui</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-bold text-slate-800">{b.title}</p>
                                            {b.summary && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{b.summary}</p>}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-slate-600 font-medium">{b.edition}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                b.category === 'buletin' ? 'bg-blue-100 text-blue-800' :
                                                b.category === 'peta' ? 'bg-purple-100 text-purple-800' :
                                                'bg-emerald-100 text-emerald-800'
                                            }`}>
                                                {b.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <a
                                                href={b.download_url && b.download_url !== '#' ? b.download_url : `/images/bmkg-hero.png`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-bmkg-primary font-mono text-[11px] font-bold transition-colors cursor-pointer group"
                                                title="Klik untuk Mengunduh / Melihat File PDF"
                                            >
                                                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                                <span>{b.file_type} ({b.file_size})</span>
                                            </a>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                                            {formatTanggalIndo(b.published_date)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 font-medium">
                                            {b.user?.name || 'Staf BMKG'}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                            {formatWaktuIndo(b.created_at)}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                            {formatWaktuIndo(b.updated_at)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleOpenDeleteModal(b)}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                title="Hapus Publikasi"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={bulletins.links}
                        from={bulletins.from}
                        to={bulletins.to}
                        total={bulletins.total}
                    />
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800">Unggah Buletin / Publikasi Iklim Baru</h3>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Judul Dokumen Publikasi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Masukkan judul dokumen buletin / analisis iklim"
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                    />
                                    {errors.title && <p className="text-red-600 text-[11px] mt-1">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nama Edisi / Periode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.edition}
                                            onChange={(e) => setData('edition', e.target.value)}
                                            placeholder="Masukkan nama edisi (misal: Edisi Januari 2026)"
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                        />
                                        {errors.edition && <p className="text-red-600 text-[11px] mt-1">{errors.edition}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Kategori Publikasi <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value as any)}
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none bg-white"
                                        >
                                            <option value="buletin">Buletin Iklim Bulanan</option>
                                            <option value="peta">Peta Spasial / HTH</option>
                                            <option value="laporan">Laporan Teknis / Statistik</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Tanggal Resmi Diterbitkan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={data.published_date}
                                        onChange={(e) => setData('published_date', e.target.value)}
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Berkas Dokumen PDF (Maks 4 MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData('file_pdf', e.target.files[0]);
                                            }
                                        }}
                                        className="w-full text-xs p-2 rounded-lg border border-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                    />
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Format file: Dokumen PDF resmi. Batas ukuran 4 MB.</span>
                                    {errors.file_pdf && <p className="text-red-600 text-[11px] mt-1">{errors.file_pdf}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Ringkasan / Abstrak Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                        placeholder="Masukkan ringkasan analisis iklim atau catatan penting"
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                    />
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
                                        {processing ? 'Mengunggah Dokumen...' : 'Terbitkan Publikasi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deleteModalOpen && bulletinToDelete && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-base font-bold text-slate-800">Konfirmasi Hapus Publikasi</h3>
                                <p className="text-xs text-slate-500">
                                    Apakah Anda yakin ingin menghapus publikasi <strong>"{bulletinToDelete.title}"</strong> ({bulletinToDelete.edition})?
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
