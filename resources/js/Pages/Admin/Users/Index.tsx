import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    Users, 
    UserPlus, 
    Edit2, 
    ShieldCheck, 
    Search, 
    CheckCircle2, 
    XCircle, 
    Mail, 
    Phone, 
    Briefcase, 
    IdCard, 
    Lock,
    KeyRound,
    Upload,
    Image as ImageIcon,
    Power,
    Trash2
} from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo } from '@/Utils/formatters';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'staf';
    nip?: string;
    jabatan?: string;
    gender?: 'pria' | 'wanita' | 'laki-laki' | 'perempuan';
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
}

interface PaginatedUsers {
    data: UserItem[];
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
}

interface Props {
    users: PaginatedUsers;
}

const PROFESSIONAL_AVATARS = [
    { id: 'avatar_pria_1.svg', gender: 'pria', label: 'Jas & Dasi Formal' },
    { id: 'avatar_pria_2.svg', gender: 'pria', label: 'Kemeja PDH & Kacamata' },
    { id: 'avatar_pria_3.svg', gender: 'pria', label: 'PDH Biru BMKG' },
    { id: 'avatar_wanita_1.svg', gender: 'wanita', label: 'Hijab Formal & Blazer' },
    { id: 'avatar_wanita_2.svg', gender: 'wanita', label: 'Blazer Rambut Rapi' },
    { id: 'avatar_wanita_3.svg', gender: 'wanita', label: 'Hijab Modern & Kacamata' },
];

export default function UsersIndex({ users }: Props) {
    const page = usePage();
    const currentUser = page.props.auth.user as UserItem;

    const [search, setSearch] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [selectedUserForStatus, setSelectedUserForStatus] = useState<UserItem | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'staf' as 'superadmin' | 'admin' | 'staf',
        nip: '',
        jabatan: '',
        gender: 'pria' as 'pria' | 'wanita',
        avatar: 'avatar_pria_1.svg',
        avatar_file: null as File | null,
        phone: '',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalOpen(false);
                setStatusModalOpen(false);
                setDeleteModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOpenCreate = () => {
        setEditingUser(null);
        reset();
        setData({
            name: '',
            email: '',
            role: 'staf',
            nip: '',
            jabatan: '',
            gender: 'pria',
            avatar: 'avatar_pria_1.svg',
            avatar_file: null,
            phone: '',
            password: '',
            password_confirmation: '',
            is_active: true,
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (u: UserItem) => {
        setEditingUser(u);
        const isWanita = u.gender === 'wanita' || u.gender === 'perempuan';
        setData({
            name: u.name,
            email: u.email,
            role: u.role,
            nip: u.nip || '',
            jabatan: u.jabatan || '',
            gender: isWanita ? 'wanita' : 'pria',
            avatar: u.avatar || (isWanita ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg'),
            avatar_file: null,
            phone: u.phone || '',
            password: '',
            password_confirmation: '',
            is_active: u.is_active,
        });
        setModalOpen(true);
    };

    const handleOpenStatusModal = (u: UserItem) => {
        setSelectedUserForStatus(u);
        setStatusModalOpen(true);
    };

    const handleOpenDeleteModal = (u: UserItem) => {
        setUserToDelete(u);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        router.delete(route('admin.users.destroy', userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteModalOpen(false),
        });
    };

    const handleToggleStatusConfirm = () => {
        if (!selectedUserForStatus) return;

        router.patch(route('admin.users.toggle-status', selectedUserForStatus.id), {}, {
            preserveScroll: true,
            onSuccess: () => setStatusModalOpen(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            router.put(route('admin.users.update', editingUser.id), {
                role: data.role,
            }, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post(route('admin.users.store'), {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const filtered = users.data.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.nip && u.nip.includes(search))
    );

    return (
        <AuthenticatedLayout title="Manajemen Pengguna & Pegawai (RBAC)">
            <Head title="Manajemen Pengguna - Admin BMKG" />

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Daftar Akun Pegawai Staklim Bone Bolango</h2>
                        <p className="text-xs text-slate-500">
                            Pengaturan hak akses sistem (Super Admin, Admin, Staf) dan status akun pegawai.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-60">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, email, atau NIP pegawai..."
                                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="px-4 py-2 rounded-lg bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold flex items-center gap-2 transition-colors flex-shrink-0 cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Tambah Pegawai Baru</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Pegawai</th>
                                    <th className="py-3 px-4">Role / Hak Akses</th>
                                    <th className="py-3 px-4">NIP & Jabatan</th>
                                    <th className="py-3 px-4">Status Akun</th>
                                    <th className="py-3 px-4">Terdaftar</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((u) => {
                                    const isSelf = u.id === currentUser.id;
                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-300 flex-shrink-0 flex items-center justify-center">
                                                        <img
                                                            src={u.avatar_url || (u.gender === 'wanita' || u.gender === 'perempuan' ? '/images/avatars/avatar_wanita_1.svg' : '/images/avatars/avatar_pria_1.svg')}
                                                            alt={u.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                            <span>{u.name}</span>
                                                            {isSelf && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-600 border border-slate-200">
                                                                    (Anda)
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                                    u.role === 'superadmin' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                                    u.role === 'admin' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                                    'bg-emerald-50 text-emerald-800 border-emerald-300'
                                                }`}>
                                                    {u.role === 'superadmin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Staf'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-mono text-slate-700 font-semibold">{u.nip || '-'}</p>
                                                <p className="text-[11px] text-slate-500">{u.jabatan || '-'}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {u.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    <span>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {formatWaktuIndo(u.created_at, false)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {isSelf ? (
                                                    <span className="text-slate-400 font-bold">-</span>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleOpenEdit(u)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-bmkg-primary hover:bg-slate-100 transition-colors cursor-pointer"
                                                            title="Edit Data Pegawai"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenStatusModal(u)}
                                                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                                u.is_active 
                                                                    ? 'text-amber-600 hover:bg-amber-50' 
                                                                    : 'text-emerald-600 hover:bg-emerald-50'
                                                            }`}
                                                            title={u.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                                                        >
                                                            <Power className="w-3.5 h-3.5" />
                                                        </button>
                                                        {currentUser.role === 'superadmin' && (
                                                            <button
                                                                onClick={() => handleOpenDeleteModal(u)}
                                                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                                title="Hapus Akun Pegawai"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={users.links}
                        from={users.from}
                        to={users.to}
                        total={users.total}
                    />
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800">
                                    {editingUser ? 'Ubah Peran (Role) Pegawai' : 'Tambah Pegawai Baru'}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {editingUser && (
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
                                        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold">Mode Pembaruan Peran</p>
                                            <p className="text-[11px] text-blue-700">Untuk akun yang telah terdaftar, Anda hanya dapat mengubah <strong>Peran (Role & Hak Akses)</strong>.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nama Lengkap & Gelar <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!!editingUser}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap & gelar"
                                            className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none ${
                                                editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary'
                                            }`}
                                        />
                                        {errors.name && <p className="text-red-600 text-[11px] mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            NIP (18 Digit)
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!!editingUser}
                                            value={data.nip}
                                            onChange={(e) => setData('nip', e.target.value)}
                                            placeholder="Masukkan 18 digit NIP pegawai"
                                            className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-mono ${
                                                editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary'
                                            }`}
                                        />
                                        {errors.nip && <p className="text-red-600 text-[11px] mt-1">{errors.nip}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            disabled={!!editingUser}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Masukkan email"
                                            className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none ${
                                                editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary'
                                            }`}
                                        />
                                        {errors.email && <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Nomor Telepon / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            disabled={!!editingUser}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Masukkan nomor telepon aktif"
                                            className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none ${
                                                editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary'
                                            }`}
                                        />
                                        {errors.phone && <p className="text-red-600 text-[11px] mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Role & Hak Akses <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value as any)}
                                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none bg-white font-semibold text-slate-800"
                                        >
                                            <option value="superadmin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="staf">Staf</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Jenis Kelamin <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            disabled={!!editingUser}
                                            value={data.gender}
                                            onChange={(e) => {
                                                const newGender = e.target.value as 'pria' | 'wanita';
                                                setData({
                                                    ...data,
                                                    gender: newGender,
                                                    avatar: newGender === 'wanita' ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg'
                                                });
                                            }}
                                            className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-medium ${
                                                editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary bg-white'
                                            }`}
                                        >
                                            <option value="pria">Pria</option>
                                            <option value="wanita">Wanita</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Jabatan / Posisi
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!!editingUser}
                                        value={data.jabatan}
                                        onChange={(e) => setData('jabatan', e.target.value)}
                                        placeholder="Masukkan nama jabatan resmi"
                                        className={`w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none ${
                                            editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary'
                                        }`}
                                    />
                                    {errors.jabatan && <p className="text-red-600 text-[11px] mt-1">{errors.jabatan}</p>}
                                </div>

                                {!editingUser && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Pilih Avatar Profil ({data.gender === 'wanita' ? 'Wanita' : 'Pria'})
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                                {PROFESSIONAL_AVATARS.filter(av => av.gender === (data.gender === 'wanita' ? 'wanita' : 'pria')).map((av) => (
                                                    <button
                                                        key={av.id}
                                                        type="button"
                                                        onClick={() => setData('avatar', av.id)}
                                                        className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                                            data.avatar === av.id
                                                                ? 'border-bmkg-primary bg-blue-50 ring-2 ring-bmkg-primary shadow-xs'
                                                                : 'border-slate-200 bg-white hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <img src={`/images/avatars/${av.id}`} alt="Avatar" className="w-16 h-16 rounded-full shadow-xs object-contain" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Atau Unggah Foto Kustom (Opsional, Maks 4 MB)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setData('avatar_file', e.target.files[0]);
                                                    }
                                                }}
                                                className="w-full text-xs p-2 rounded-lg border border-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                            />
                                            <span className="text-[10px] text-slate-400 block mt-0.5">Format: JPEG, PNG, WebP. Maksimal 4 MB.</span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Masukkan password"
                                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                            />
                                            {errors.password && <p className="text-red-600 text-[11px] mt-1">{errors.password}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Konfirmasi Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Masukkan konfirmasi password"
                                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary outline-none"
                                            />
                                        </div>
                                    </>
                                )}

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
                                        {processing ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan Peran' : 'Daftarkan Akun'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {statusModalOpen && selectedUserForStatus && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                                <Power className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-base font-bold text-slate-800">
                                    {selectedUserForStatus.is_active ? 'Nonaktifkan Akun Pegawai?' : 'Aktifkan Kembali Akun Pegawai?'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {selectedUserForStatus.is_active 
                                        ? `Pegawai "${selectedUserForStatus.name}" tidak akan dapat masuk ke dashboard sistem setelah dinonaktifkan.` 
                                        : `Pegawai "${selectedUserForStatus.name}" akan dapat kembali mengakses dashboard sistem.`}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStatusModalOpen(false)}
                                    className="py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleToggleStatusConfirm}
                                    className={`py-2 px-4 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer ${
                                        selectedUserForStatus.is_active ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                                >
                                    {selectedUserForStatus.is_active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModalOpen && userToDelete && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-base font-bold text-slate-800">
                                    Konfirmasi Hapus Akun Pegawai
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Apakah Anda yakin ingin menghapus akun pegawai <strong>"{userToDelete.name}"</strong> ({userToDelete.email})? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
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
                                    className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Ya, Hapus Akun
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
