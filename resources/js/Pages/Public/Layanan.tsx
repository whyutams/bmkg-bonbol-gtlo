import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    FileText, 
    Send, 
    CheckCircle2, 
    Coins, 
    HelpCircle, 
    FileCheck, 
    ExternalLink, 
    ShieldCheck, 
    Building2,
    Clock,
    AlertCircle,
    Download,
    Star,
    Sparkles
} from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';

export default function Layanan() {
    const { flash } = usePage().props as { flash?: { success?: string; ticket_number?: string; success_ikm?: string; ikm_score?: number } };
    const [ticketModalOpen, setTicketModalOpen] = useState<boolean>(false);
    const [generatedTicket, setGeneratedTicket] = useState<string>('');
    const [ikmModalOpen, setIkmModalOpen] = useState<boolean>(false);
    const [ikmSuccessOpen, setIkmSuccessOpen] = useState<boolean>(false);
    const [submittedScore, setSubmittedScore] = useState<number>(0);

    // Form Permohonan PTSP
    const { data: ptspData, setData: setPtspData, post: postPtsp, processing: ptspProcessing, reset: resetPtsp } = useForm({
        applicant_name: '',
        institution: '',
        email: '',
        phone: '',
        purpose_category: 'Mahasiswa / Riset Pendidikan (Tarif Rp 0)',
        data_requested: 'Data Curah Hujan Bulanan (Historis)',
        date_range: '2020 - 2025',
        admin_notes: ''
    });

    // Form Survei IKM (9 Unsur PermenPAN-RB No. 14/2017)
    const { data: ikmData, setData: setIkmData, post: postIkm, processing: ikmProcessing, reset: resetIkm, errors: ikmErrors } = useForm({
        respondent_name: '',
        email: '',
        phone: '',
        service_type: 'Permintaan Data Klimatologi / Penelitian',
        q1_persyaratan: 4,
        q2_prosedur: 4,
        q3_waktu: 4,
        q4_biaya: 4,
        q5_produk: 4,
        q6_kompetensi: 4,
        q7_perilaku: 4,
        q8_sarana: 4,
        q9_pengaduan: 4,
        feedback: ''
    });

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setTicketModalOpen(false);
                setIkmModalOpen(false);
                setIkmSuccessOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handlePtspSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postPtsp('/layanan/ptsp', {
            preserveScroll: true,
            onSuccess: (page) => {
                const pageFlash = page.props.flash as { ticket_number?: string };
                if (pageFlash?.ticket_number) {
                    setGeneratedTicket(pageFlash.ticket_number);
                }
                setTicketModalOpen(true);
                resetPtsp();
            }
        });
    };

    const handleIkmSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postIkm('/layanan/ikm', {
            preserveScroll: true,
            onSuccess: (page) => {
                const pageFlash = page.props.flash as { ikm_score?: number };
                if (pageFlash?.ikm_score) {
                    setSubmittedScore(pageFlash.ikm_score);
                }
                setIkmModalOpen(false);
                setIkmSuccessOpen(true);
                resetIkm();
            }
        });
    };

    const IKM_QUESTIONS = [
        { id: 'q1_persyaratan', title: '1. Persyaratan Pelayanan', desc: 'Kemudahan memenuhi persyaratan administratif permohonan data.' },
        { id: 'q2_prosedur', title: '2. Prosedur & Alur Pelayanan', desc: 'Kemudahan alur dan tahapan permohonan data secara online/offline.' },
        { id: 'q3_waktu', title: '3. Kecepatan Waktu Pelayanan', desc: 'Ketepatan dan kecepatan penyelesaian pelayanan sesuai standar (1-3 hari).' },
        { id: 'q4_biaya', title: '4. Kesesuaian Biaya / Tarif', desc: 'Kejelasan tarif resmi PP No. 47/2018 atau layanan Rp 0 bagi mahasiswa.' },
        { id: 'q5_produk', title: '5. Kualitas Produk / Data Layanan', desc: 'Akurasi, kelengkapan, dan format data iklim/cuaca yang diterima.' },
        { id: 'q6_kompetensi', title: '6. Kompetensi Petugas Pelaksana', desc: 'Keahlian, ketelitian, dan penguasaan materi teknis oleh petugas BMKG.' },
        { id: 'q7_perilaku', title: '7. Perilaku & Keramahan Petugas', desc: 'Kesopanan, keramahan, responsif, dan integritas (bebas pungli).' },
        { id: 'q8_sarana', title: '8. Kualitas Sarana & Web Portal', desc: 'Kenyamanan fasilitas loket PTSP dan kemudahan navigasi portal web.' },
        { id: 'q9_pengaduan', title: '9. Penanganan Saran & Pengaduan', desc: 'Responsivitas tindak lanjut atas pertanyaan, masukan, atau keluhan.' },
    ];

    return (
        <MainLayout title="Pelayanan Publik, Tarif PNBP, dan Permintaan Data">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
                
                <div className="border-b border-bmkg-border pb-4">
                    <div className="flex items-center gap-2 text-xs text-bmkg-muted mb-1">
                        <span>Beranda</span>
                        <span>/</span>
                        <span className="text-bmkg-primary font-semibold">Pelayanan Publik</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-bmkg-navy tracking-tight">
                        Pelayanan Terpadu Satu Pintu (PTSP) Staklim Bone Bolango
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Permohonan data meteorologi, klimatologi, informasi tarif resmi PNBP, layanan tarif Rp 0, dan evaluasi kepuasan masyarakat.
                    </p>
                </div>

                {/* Maklumat Pelayanan */}
                <section id="ptsp" className="bg-[#0f172a] text-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-800">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-3xl">
                            <span className="bg-white/20 border border-white/25 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                Maklumat Pelayanan BMKG
                            </span>
                            <h2 className="text-lg sm:text-xl font-black">
                                Zona Integritas: Bebas dari Korupsi, Kolusi, dan Gratifikasi
                            </h2>
                            <p className="text-xs text-white/90 leading-relaxed text-justify">
                                "Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan publik sesuai standar pelayanan yang telah ditetapkan, dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai ketentuan peraturan perundang-undangan."
                            </p>
                        </div>

                        <div className="flex-shrink-0 bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                            <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                            <strong className="block text-xs uppercase font-extrabold">Wilayah Bebas Korupsi</strong>
                            <span className="text-[10px] text-slate-400">Kepatuhan UU No. 25/2009</span>
                        </div>
                    </div>
                </section>

                {/* Tahapan Alur */}
                <section className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-bmkg-navy mb-4">
                        Alur & Prosedur Permohonan Data Klimatologi
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                            <strong className="block text-bmkg-primary font-bold mb-1">1. Pengajuan Online</strong>
                            <p className="text-gray-600 text-[11px]">Mengisi formulir di bawah ini beserta data identitas & kebutuhan data iklim.</p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                            <strong className="block text-bmkg-primary font-bold mb-1">2. Verifikasi Berkas</strong>
                            <p className="text-gray-600 text-[11px]">Petugas loket memverifikasi kriteria tarif (Rp 0 atau billing SIMPONI PNBP).</p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                            <strong className="block text-bmkg-primary font-bold mb-1">3. Pengolahan Data</strong>
                            <p className="text-gray-600 text-[11px]">Staf teknis mengekstraksi dan memvalidasi dataset klimatologi yang diminta.</p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                            <strong className="block text-bmkg-primary font-bold mb-1">4. Penyerahan Data</strong>
                            <p className="text-gray-600 text-[11px]">Data diserahkan via email resmi/WhatsApp disertai tautan survei IKM.</p>
                        </div>
                    </div>
                </section>

                {/* Form Permohonan & Kuesioner IKM */}
                <section id="form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2 text-bmkg-primary">
                                <FileText className="w-5 h-5" />
                                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-bmkg-navy">
                                    Formulir Permintaan Data Klimatologi Online
                                </h2>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Silakan isi formulir di bawah ini dengan data yang valid. Petugas kami akan memproses dalam 1-2 hari kerja.
                            </p>
                        </div>

                        <form onSubmit={handlePtspSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Nama Lengkap Pemohon <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={ptspData.applicant_name}
                                        onChange={(e) => setPtspData('applicant_name', e.target.value)}
                                        placeholder="Masukkan nama lengkap pemohon"
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Instansi / Universitas <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={ptspData.institution}
                                        onChange={(e) => setPtspData('institution', e.target.value)}
                                        placeholder="Masukkan nama instansi / universitas"
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Alamat Email Aktif <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={ptspData.email}
                                        onChange={(e) => setPtspData('email', e.target.value)}
                                        placeholder="Masukkan alamat email aktif"
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        No. Telepon / WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={ptspData.phone}
                                        onChange={(e) => setPtspData('phone', e.target.value)}
                                        placeholder="Masukkan nomor telepon / WhatsApp"
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Kategori Pemohon
                                    </label>
                                    <select
                                        value={ptspData.purpose_category}
                                        onChange={(e) => setPtspData('purpose_category', e.target.value)}
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent bg-white"
                                    >
                                        <option>Mahasiswa / Riset Pendidikan (Tarif Rp 0)</option>
                                        <option>Instansi Pemerintah / BUMN</option>
                                        <option>Swasta / Perusahaan / Komersial (PNBP)</option>
                                        <option>Masyarakat Umum / Perorangan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Jenis Informasi Data yang Diminta
                                    </label>
                                    <select
                                        value={ptspData.data_requested}
                                        onChange={(e) => setPtspData('data_requested', e.target.value)}
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent bg-white"
                                    >
                                        <option>Data Curah Hujan Bulanan (Historis)</option>
                                        <option>Data Curah Hujan Harian (Dasarian)</option>
                                        <option>Data Suhu Udara & Kelembaban Harian</option>
                                        <option>Prakiraan Musim Hujan / Kemarau (ZOM)</option>
                                        <option>Informasi Ekstrem / Hari Tanpa Hujan</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Rentang Periode Tahun
                                </label>
                                <input
                                    type="text"
                                    value={ptspData.date_range}
                                    onChange={(e) => setPtspData('date_range', e.target.value)}
                                    placeholder="Masukkan rentang periode tahun (misal: 2020 - 2025)"
                                    className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Rincian & Keperluan Penggunaan Data <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={ptspData.admin_notes}
                                    onChange={(e) => setPtspData('admin_notes', e.target.value)}
                                    placeholder="Masukkan rincian judul penelitian, skripsi, atau tujuan penggunaan data klimatologi"
                                    className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={ptspProcessing}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-bmkg-primary hover:bg-bmkg-secondary text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{ptspProcessing ? 'Mengirim ke Loket PTSP...' : 'Kirim Permohonan Data'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        {/* Kuesioner IKM Online Native */}
                        <div id="ikm" className="bg-white rounded-xl border border-bmkg-border p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-bmkg-primary">
                                <FileCheck className="w-5 h-5" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-bmkg-navy">
                                    Survey Kepuasan Masyarakat (IKM)
                                </h3>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Evaluasi pelayanan kami dengan mengisi Survey Indeks Kepuasan Masyarakat (IKM) 9 unsur PermenPAN-RB No. 14/2017 secara langsung dan tersimpan ke database analitik stasiun.
                            </p>
                            
                            <button
                                type="button"
                                onClick={() => setIkmModalOpen(true)}
                                className="w-full py-2.5 px-4 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Isi Kuesioner IKM Online Sekarang</span>
                            </button>
                        </div>

                        {/* Info Tarif PNBP */}
                        <div className="bg-white rounded-xl border border-bmkg-border p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-bmkg-navy">
                                <Coins className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                    Tarif Resmi & Akuntabilitas
                                </h3>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Seluruh penerimaan tarif disetorkan ke Kas Negara melalui kode billing SIMPONI Kementerian Keuangan RI. Mahasiswa dengan surat pengantar resmi berhak atas tarif Rp 0 (Bebas Biaya).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Modal Tiket Berhasil */}
                {ticketModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in zoom-in-95 duration-200">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-extrabold text-bmkg-navy">
                                    Permohonan Berhasil Tercatat!
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Data permohonan Anda telah resmi tersimpan pada sistem PTSP Stasiun Klimatologi Bone Bolango.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                    Nomor Tiket Permohonan
                                </span>
                                <div className="text-lg font-mono font-extrabold text-bmkg-primary tracking-wide select-all">
                                    {generatedTicket || 'PTSP-BMKG-ONLINE'}
                                </div>
                                <span className="text-[10px] text-slate-400 block">
                                    Simpan nomor tiket ini untuk pengecekan status pelayanan.
                                </span>
                            </div>

                            <div className="text-[11px] text-slate-600 bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-1">
                                <strong className="block text-bmkg-navy">Langkah Selanjutnya:</strong>
                                <p>1. Petugas akan memverifikasi berkas dalam 1-2 hari kerja.</p>
                                <p>2. Konfirmasi kelengkapan dan instruksi penyerahan data akan disampaikan via email / WhatsApp.</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setTicketModalOpen(false)}
                                className="w-full py-2.5 rounded-xl bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Tutup & Selesai
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Kuesioner IKM Online */}
                {ikmModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Kuesioner Survei Indeks Kepuasan Masyarakat (IKM)
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Berdasarkan 9 Unsur Pelayanan Publik (PermenPAN-RB No. 14 Tahun 2017)
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIkmModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleIkmSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Nama Lengkap Anda <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={ikmData.respondent_name}
                                            onChange={(e) => setIkmData('respondent_name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Alamat Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={ikmData.email}
                                            onChange={(e) => setIkmData('email', e.target.value)}
                                            placeholder="Masukkan email aktif"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Nomor Telepon / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            value={ikmData.phone}
                                            onChange={(e) => setIkmData('phone', e.target.value)}
                                            placeholder="Masukkan nomor telepon"
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">
                                            Jenis Layanan yang Diterima <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={ikmData.service_type}
                                            onChange={(e) => setIkmData('service_type', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:border-bmkg-primary"
                                        >
                                            <option>Permintaan Data Klimatologi / Penelitian</option>
                                            <option>Konsultasi Informasi Iklim & Musim</option>
                                            <option>Data Perencanaan Pembangunan / Hidrologi</option>
                                            <option>Informasi Cuaca Ekstrem & Kebencanaan</option>
                                            <option>Layanan Lainnya</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 text-xs">Penilaian 9 Unsur Pelayanan:</span>
                                        <span className="text-[10px] text-slate-500">(1 = Buruk, 2 = Kurang, 3 = Baik, 4 = Sangat Baik)</span>
                                    </div>

                                    <div className="space-y-2.5">
                                        {IKM_QUESTIONS.map((q) => {
                                            const val = ikmData[q.id as keyof typeof ikmData] as number;
                                            return (
                                                <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-[11px]">{q.title}</h4>
                                                        <p className="text-[10px] text-slate-500">{q.desc}</p>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                        {[1, 2, 3, 4].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setIkmData(q.id as any, star)}
                                                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                                                    val === star
                                                                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                {star} {star === 4 ? '★' : ''}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">
                                        Kritik, Saran, dan Masukan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={ikmData.feedback}
                                        onChange={(e) => setIkmData('feedback', e.target.value)}
                                        placeholder="Berikan saran membangun untuk peningkatan kualitas pelayanan BMKG Bone Bolango..."
                                        className="w-full p-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-bmkg-primary"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIkmModalOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={ikmProcessing}
                                        className="px-5 py-2 text-xs font-bold bg-bmkg-primary hover:bg-bmkg-dark text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {ikmProcessing ? 'Mengirim Survei...' : 'Kirim Survei Kepuasan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Sukses IKM */}
                {ikmSuccessOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">
                                Terima Kasih Atas Penilaian Anda!
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Survei Indeks Kepuasan Masyarakat (IKM) berhasil dikirim dan tersimpan pada sistem database BMKG Bone Bolango.
                            </p>

                            {submittedScore > 0 && (
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                                    <span className="text-[10px] uppercase font-bold block text-amber-700">Skor Indeks Layanan Anda</span>
                                    <span className="font-mono text-xl font-black">{submittedScore} / 100</span>
                                    <span className="text-[11px] font-bold block text-emerald-700 mt-0.5">Mutu Pelayanan: A (Sangat Baik)</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIkmSuccessOpen(false)}
                                className="w-full py-2.5 rounded-xl bg-bmkg-primary hover:bg-bmkg-dark text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                )}

                {/* Tarif PNBP */}
                <section id="pnbp" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Coins className="w-5 h-5 text-slate-500" />
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                    Daftar Tarif PNBP BMKG
                                </h3>
                                <span className="text-[10px] text-gray-400">Dasar Hukum: PP No. 47 Tahun 2018</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-bmkg-border bg-bmkg-surface text-[11px] font-bold text-bmkg-navy">
                                        <th className="py-2 px-2.5">Jenis Informasi</th>
                                        <th className="py-2 px-2.5">Satuan</th>
                                        <th className="py-2 px-2.5 text-right">Tarif</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                    <tr>
                                        <td className="py-2.5 px-2.5">Informasi Curah Hujan Bulanan</td>
                                        <td className="py-2.5 px-2.5 text-gray-500">Per Stasiun / Tahun</td>
                                        <td className="py-2.5 px-2.5 font-mono font-semibold text-right">Rp 65.000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-2.5">Informasi Curah Hujan Harian</td>
                                        <td className="py-2.5 px-2.5 text-gray-500">Per Stasiun / Bulan</td>
                                        <td className="py-2.5 px-2.5 font-mono font-semibold text-right">Rp 80.000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-2.5">Prakiraan Musim Hujan / Kemarau</td>
                                        <td className="py-2.5 px-2.5 text-gray-500">Per Buku / Wilayah</td>
                                        <td className="py-2.5 px-2.5 font-mono font-semibold text-right">Rp 150.000</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-2.5">Atlas Iklim Indonesia</td>
                                        <td className="py-2.5 px-2.5 text-gray-500">Per Buku</td>
                                        <td className="py-2.5 px-2.5 font-mono font-semibold text-right">Rp 250.000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-[11px] text-gray-500 pt-1">
                            Pembayaran PNBP disetorkan langsung ke kas negara melalui rekening resmi Bendahara Penerima BMKG via sistem SIMPONI Kementerian Keuangan.
                        </div>
                    </div>

                    <div id="gratis" className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <ShieldCheck className="w-5 h-5 text-slate-600" />
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                    Layanan Tarif Rp 0 (Bebas Biaya)
                                </h3>
                                <span className="text-[10px] text-gray-400">Sesuai Peraturan BMKG No. 12 Tahun 2019</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed">
                            Masyarakat dapat memperoleh data dan informasi klimatologi secara cuma-cuma (gratis) untuk kriteria kegiatan tertentu, antara lain:
                        </p>

                        <ul className="space-y-2 text-xs text-gray-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                <span>Pendidikan dan penelitian ilmiah (skripsi, tesis, disertasi mahasiswa).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                <span>Penanggulangan bencana alam, SAR, dan penanganan darurat hidrometeorologi.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                <span>Kegiatan sosial kemasyarakatan dan pertahanan keamanan negara.</span>
                            </li>
                        </ul>

                        <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-800">
                            <strong>Persyaratan:</strong> Melampirkan surat permohonan resmi dari Dekan / Pimpinan Lembaga, proposal riset, dan surat pernyataan bermaterai bahwa data tidak dikomersialkan.
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
