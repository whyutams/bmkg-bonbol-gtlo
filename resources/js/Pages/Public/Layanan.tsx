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
    Download
} from 'lucide-react';

import { useForm, usePage } from '@inertiajs/react';

export default function Layanan() {
    const { flash } = usePage().props as { flash?: { success?: string; ticket_number?: string } };
    const [ticketModalOpen, setTicketModalOpen] = useState<boolean>(false);
    const [generatedTicket, setGeneratedTicket] = useState<string>('');

    const { data, setData, post, processing, reset } = useForm({
        applicant_name: '',
        institution: '',
        email: '',
        phone: '',
        purpose_category: 'Mahasiswa / Riset Pendidikan (Tarif Rp 0)',
        data_requested: 'Data Curah Hujan Bulanan (Historis)',
        date_range: '2020 - 2025',
        admin_notes: ''
    });

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setTicketModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/layanan/ptsp', {
            preserveScroll: true,
            onSuccess: (page) => {
                const pageFlash = page.props.flash as { ticket_number?: string };
                if (pageFlash?.ticket_number) {
                    setGeneratedTicket(pageFlash.ticket_number);
                }
                setTicketModalOpen(true);
                reset();
            }
        });
    };


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

                
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy border-b border-gray-100 pb-2">
                        Alur Pelayanan Permintaan Data BMKG
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-bmkg-border shadow-xs flex flex-col justify-between">
                            <div>
                                <span className="w-6 h-6 rounded-full bg-bmkg-primary text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
                                <h4 className="text-xs font-bold text-bmkg-navy mb-1">Pengajuan Permohonan</h4>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Pemohon mengisi formulir online di website ini atau datang ke loket PTSP dengan menyertakan surat pengantar resmi instansi/kampus.
                                </p>
                            </div>
                            <span className="text-[10px] text-bmkg-primary font-semibold mt-3 block">Tahap 1: Verifikasi</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-bmkg-border shadow-xs flex flex-col justify-between">
                            <div>
                                <span className="w-6 h-6 rounded-full bg-bmkg-primary text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
                                <h4 className="text-xs font-bold text-bmkg-navy mb-1">Telaah & Validasi Data</h4>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Petugas stasiun memeriksa ketersediaan data pada basis data klimatologi Bone Bolango dan mengonfirmasi periode yang diminta.
                                </p>
                            </div>
                            <span className="text-[10px] text-bmkg-primary font-semibold mt-3 block">Tahap 2: Pengolahan</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-bmkg-border shadow-xs flex flex-col justify-between">
                            <div>
                                <span className="w-6 h-6 rounded-full bg-bmkg-primary text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
                                <h4 className="text-xs font-bold text-bmkg-navy mb-1">Penerbitan Billing / Rp 0</h4>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Penerbitan kode bayar SIMPONI untuk tarif PNBP, atau pengesahan Surat Keterangan Tarif Rp 0 untuk keperluan penelitian pendidikan.
                                </p>
                            </div>
                            <span className="text-[10px] text-bmkg-primary font-semibold mt-3 block">Tahap 3: Pembayaran / Surat</span>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-bmkg-border shadow-xs flex flex-col justify-between">
                            <div>
                                <span className="w-6 h-6 rounded-full bg-bmkg-primary text-white text-xs font-bold flex items-center justify-center mb-2">4</span>
                                <h4 className="text-xs font-bold text-bmkg-navy mb-1">Penyerahan Data Resmi</h4>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    Data resmi diserahkan dalam bentuk cetak dan/atau format digital (Excel / PDF) yang dilengkapi pengesahan pejabat BMKG.
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-600 font-semibold mt-3 block">Tahap 4: Selesai</span>
                        </div>
                    </div>
                </section>

                
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

                            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">
                                            Nama Lengkap Pemohon <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.applicant_name}
                                            onChange={(e) => setData('applicant_name', e.target.value)}
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
                                            value={data.institution}
                                            onChange={(e) => setData('institution', e.target.value)}
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
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
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
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
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
                                            value={data.purpose_category}
                                            onChange={(e) => setData('purpose_category', e.target.value)}
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
                                            value={data.data_requested}
                                            onChange={(e) => setData('data_requested', e.target.value)}
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
                                        value={data.date_range}
                                        onChange={(e) => setData('date_range', e.target.value)}
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
                                        value={data.admin_notes}
                                        onChange={(e) => setData('admin_notes', e.target.value)}
                                        placeholder="Masukkan rincian judul penelitian, skripsi, atau tujuan penggunaan data klimatologi"
                                        className="w-full p-2.5 border border-bmkg-border rounded-lg text-xs outline-none focus:ring-1 focus:ring-bmkg-accent"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-bmkg-primary hover:bg-bmkg-secondary text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{processing ? 'Mengirim ke Loket PTSP...' : 'Kirim Permohonan Data'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-xl border border-bmkg-border p-5 shadow-sm space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-bmkg-navy">
                                    Alternatif Formulir Online
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Anda juga dapat mengisi formulir permohonan melalui form resmi Google Forms Stasiun Klimatologi Gorontalo:
                                </p>
                                <a
                                    href="https://forms.gle/5kErAVjPMzTtc9577"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center py-2.5 px-4 rounded-lg bg-bmkg-surface border border-bmkg-border hover:border-bmkg-accent text-bmkg-primary font-bold text-xs transition-colors"
                                >
                                    Buka Google Form Resmi ↗
                                </a>
                            </div>

                            <div id="ikm" className="bg-white rounded-xl border border-bmkg-border p-5 shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-bmkg-primary">
                                    <FileCheck className="w-4 h-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-bmkg-navy">
                                        Survey Kepuasan Masyarakat (IKM)
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Evaluasi pelayanan kami dengan mengisi Survey Indeks Kepuasan Masyarakat demi perbaikan mutu pelayanan publik BMKG Bone Bolango.
                                </p>
                                <a
                                    href="https://forms.gle/Pkhr2fwQmtrJmexx6"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center py-2.5 px-4 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                                >
                                    Isi Kuesioner IKM ↗
                                </a>
                            </div>
                        </div>
                    </section>

                    {ticketModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-200">
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
