import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <header className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-rose-700">
                    Hapus Akun Pengguna
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                    Setelah akun Anda dihapus, semua sumber daya dan data terkait akan dihapus secara permanen. Pastikan Anda telah mengunduh data penting sebelum melanjutkan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="text-xs px-4 py-2 cursor-pointer">
                Hapus Akun Saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="text-xs text-slate-600">
                        Tindakan ini tidak dapat dibatalkan. Masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500"
                            isFocused
                            placeholder="Masukkan kata sandi Anda"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-1.5"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <SecondaryButton onClick={closeModal} className="text-xs cursor-pointer">
                            Batal
                        </SecondaryButton>

                        <DangerButton className="text-xs cursor-pointer" disabled={processing}>
                            Konfirmasi Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
