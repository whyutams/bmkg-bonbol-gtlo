import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">
                    Perbarui Kata Sandi (Password)
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan aman untuk menjaga keamanan sistem.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-4 max-w-xl">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kata Sandi Saat Ini <span className="text-red-500">*</span>
                    </label>

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        placeholder="Masukkan kata sandi saat ini"
                        className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kata Sandi Baru <span className="text-red-500">*</span>
                    </label>

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        placeholder="Masukkan kata sandi baru"
                        className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                    </label>

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        placeholder="Ulangi kata sandi baru"
                        className="w-full text-xs p-2.5 rounded-lg border-slate-300 focus:border-bmkg-primary focus:ring-bmkg-primary"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-bmkg-primary hover:bg-bmkg-navy text-white text-xs px-5 py-2.5 rounded-lg cursor-pointer"
                    >
                        Simpan Kata Sandi
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
                            Kata sandi berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
