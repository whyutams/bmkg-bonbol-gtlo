import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Shield, Lock } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user as any;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-800 leading-tight">
                            Pengaturan Profil Akun
                        </h2>
                        <p className="text-xs text-slate-500">
                            Kelola identitas, kata sandi, dan kredensial akun Anda.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Profil Akun" />

            <div className="py-6 max-w-4xl space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="w-full"
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <UpdatePasswordForm className="w-full" />
                </div>

                {user.role !== 'superadmin' ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                        <DeleteUserForm className="w-full" />
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
                        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p>
                            <strong>Akun Super Admin Terproteksi:</strong> Akun Super Admin tidak dapat dihapus secara mandiri untuk menjaga integritas dan ketersediaan akses sistem Staklim Bone Bolango.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
