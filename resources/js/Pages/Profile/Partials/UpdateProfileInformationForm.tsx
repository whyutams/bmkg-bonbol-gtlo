import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

const AVATAR_OPTIONS = [
    { id: 'avatar_pria_1.svg', gender: 'pria' },
    { id: 'avatar_pria_2.svg', gender: 'pria' },
    { id: 'avatar_pria_3.svg', gender: 'pria' },
    { id: 'avatar_wanita_1.svg', gender: 'wanita' },
    { id: 'avatar_wanita_2.svg', gender: 'wanita' },
    { id: 'avatar_wanita_3.svg', gender: 'wanita' },
];

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user as any;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            nip: user.nip || '',
            jabatan: user.jabatan || '',
            phone: user.phone || '',
            gender: (user.gender === 'wanita' ? 'wanita' : 'pria') as 'pria' | 'wanita',
            avatar: user.avatar || (user.gender === 'wanita' ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg'),
            avatar_file: null as File | null,
            _method: 'patch',
        });

    const roleLabel = user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Staf';
    const roleBadgeClass = user.role === 'superadmin' 
        ? 'bg-amber-100 text-amber-800 border-amber-300' 
        : user.role === 'admin' 
        ? 'bg-blue-100 text-blue-800 border-blue-300' 
        : 'bg-emerald-100 text-emerald-800 border-emerald-300';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Informasi Profil Pegawai
                        </h2>
                        <p className="mt-1 text-xs text-slate-600">
                            Perbarui identitas profil, jabatan, nomor kontak, dan avatar akun Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${roleBadgeClass}`}>
                            {roleLabel}
                        </span>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Lengkap & Gelar <span className="text-red-500">*</span>
                        </label>
                        <TextInput
                            id="name"
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Masukkan nama lengkap & gelar"
                            autoComplete="name"
                        />
                        <InputError className="mt-1.5" message={errors.name} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            NIP (18 Digit)
                        </label>
                        <TextInput
                            id="nip"
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary font-mono"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                            placeholder="Masukkan 18 digit NIP pegawai"
                        />
                        <InputError className="mt-1.5" message={errors.nip} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <TextInput
                            id="email"
                            type="email"
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="Masukkan email"
                            autoComplete="username"
                        />
                        <InputError className="mt-1.5" message={errors.email} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nomor Telepon / WhatsApp
                        </label>
                        <TextInput
                            id="phone"
                            type="tel"
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Masukkan nomor telepon aktif"
                        />
                        <InputError className="mt-1.5" message={errors.phone} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Jabatan / Posisi
                        </label>
                        <TextInput
                            id="jabatan"
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                            value={data.jabatan}
                            onChange={(e) => setData('jabatan', e.target.value)}
                            placeholder="Masukkan nama jabatan resmi"
                        />
                        <InputError className="mt-1.5" message={errors.jabatan} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Jenis Kelamin <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.gender}
                            onChange={(e) => {
                                const newGender = e.target.value as 'pria' | 'wanita';
                                setData({
                                    ...data,
                                    gender: newGender,
                                    avatar: newGender === 'wanita' ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg',
                                });
                            }}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-bmkg-primary focus:ring-1 focus:ring-bmkg-primary bg-white outline-none"
                        >
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                        </select>
                        <InputError className="mt-1.5" message={errors.gender} />
                    </div>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700">
                        Pilih Avatar Profil ({data.gender === 'wanita' ? 'Wanita' : 'Pria'})
                    </label>
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        {AVATAR_OPTIONS.filter((av) => av.gender === data.gender).map((av) => (
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
                                <img
                                    src={`/images/avatars/${av.id}`}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full shadow-xs object-contain"
                                />
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Atau Unggah Foto Profil Kustom (Opsional, Maks 4 MB)
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
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                            Format: JPEG, PNG, WebP. Maksimal 4 MB.
                        </span>
                        <InputError className="mt-1.5" message={errors.avatar_file} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                            Email Anda belum terverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-bold underline text-amber-900 hover:text-amber-700"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-medium text-emerald-600">
                                Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-bmkg-primary hover:bg-bmkg-navy text-white text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                    >
                        Simpan Perubahan
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Profil berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
