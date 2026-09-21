import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ClimateMap from '@/Components/BMKG/ClimateMap';
import { 
    Building2, 
    Target, 
    Compass, 
    Users, 
    MapPin, 
    Phone, 
    Mail, 
    Award, 
    ShieldCheck, 
    CheckCircle2,
    Calendar
} from 'lucide-react';
interface StaffUser {
    id: number;
    name: string;
    role: 'superadmin' | 'admin' | 'staf';
    nip?: string;
    jabatan?: string;
    gender?: string;
    avatar?: string;
    avatar_url?: string;
}

interface ProfilProps {
    dbStations?: any[];
    staffMembers?: StaffUser[];
}

export default function Profil({ staffMembers = [] }: ProfilProps) {
    return (
        <MainLayout title="Profil Instansi & Struktur Organisasi">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
                
                <div className="border-b border-bmkg-border pb-4">
                    <div className="flex items-center gap-2 text-xs text-bmkg-muted mb-1">
                        <span>Beranda</span>
                        <span>/</span>
                        <span className="text-bmkg-primary font-semibold">Profil Instansi</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-bmkg-navy tracking-tight">
                        Profil Stasiun Klimatologi BMKG Bone Bolango
                    </h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Informasi kelembagaan, visi misi, tata kelola, dan sumber daya manusia Stasiun Klimatologi Bone Bolango.
                    </p>
                </div>

                
                <section id="instansi" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-bmkg-primary">
                            <Building2 className="w-5 h-5" />
                            <h2 className="text-base font-bold uppercase tracking-wider text-bmkg-navy">
                                Gambaran Umum Instansi
                            </h2>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-700 text-justify">
                            <strong>Stasiun Klimatologi Bone Bolango</strong> merupakan Unit Pelaksana Teknis (UPT) di bawah naungan Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) Republik Indonesia. Berlokasi strategis di Jalan Prof. Dr. Ing. B. J. Habibie, Desa Moutong, Kecamatan Tilongkabila, Kabupaten Bone Bolango, stasiun ini memegang peranan krusial sebagai pusat pemantauan iklim, analisis curah hujan, dan penyebaran informasi cuaca bagi seluruh kawasan Provinsi Gorontalo.
                        </p>
                        <p className="text-xs leading-relaxed text-gray-700 text-justify">
                            Keberadaan Stasiun Klimatologi ini mendukung program strategis ketahanan pangan nasional, sektor pertanian agroklimat, kelautan, kebencanaan hidrometeorologi (banjir dan kekeringan), serta tata ruang wilayah di kawasan Teluk Tomini dan sekitarnya.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="p-3 rounded-lg bg-bmkg-surface border border-bmkg-border/70 text-xs">
                                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status Kelembagaan</span>
                                <strong className="text-bmkg-navy font-semibold">UPT Kelas II BMKG Wilayah Sulawesi</strong>
                            </div>
                            <div className="p-3 rounded-lg bg-bmkg-surface border border-bmkg-border/70 text-xs">
                                <span className="text-[10px] uppercase font-bold text-gray-400 block">Zona Waktu Kerja</span>
                                <strong className="text-bmkg-navy font-semibold">WITA (UTC +8:00) / 24 Jam Monitoring</strong>
                            </div>
                        </div>
                    </div>

                    
                    <div className="bg-[#0f172a] text-white rounded-xl p-6 shadow-sm space-y-4 border border-slate-800">
                        <div className="flex items-center gap-2 border-b border-white/20 pb-3">
                            <Award className="w-5 h-5 text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">
                                Zona Integritas BMKG
                            </h3>
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed">
                            Stasiun Klimatologi Bone Bolango berkomitmen penuh mewujudkan penyelenggaraan pelayanan publik yang bersih, transparan, dan bebas gratifikasi menuju predikat Wilayah Bebas dari Korupsi (WBK).
                        </p>
                        <div className="space-y-2 pt-2 text-xs border-t border-white/15">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                <span>Pelayanan Akuntabel & Cepat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                <span>Kesesuaian Standar Tarif PNBP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                <span>Saluran Pengaduan WBS 24 Jam</span>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section id="visi-misi" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-bmkg-primary mb-3">
                            <Target className="w-5 h-5" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                Visi BMKG
                            </h2>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex-1 flex items-center">
                            <blockquote className="text-xs sm:text-sm font-semibold italic text-bmkg-navy leading-relaxed">
                                "Mewujudkan BMKG yang handal, tanggap dan mampu dalam rangka mendukung keselamatan masyarakat serta keberhasilan pembangunan nasional, dan berperan aktif di tingkat internasional."
                            </blockquote>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-bmkg-primary mb-3">
                            <Compass className="w-5 h-5" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy">
                                Misi BMKG
                            </h2>
                        </div>
                        <ul className="space-y-2.5 text-xs text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-bmkg-light text-bmkg-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                                <span>Mengamati dan memahami fenomena meteorologi, klimatologi, kualitas udara dan geofisika.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-bmkg-light text-bmkg-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                                <span>Menyediakan data, informasi dan jasa meteorologi, klimatologi, kualitas udara dan geofisika yang handal dan terpercaya.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-bmkg-light text-bmkg-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                                <span>Mengkoordinasikan dan memfasilitasi kegiatan di bidang meteorologi, klimatologi, kualitas udara dan geofisika.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-bmkg-light text-bmkg-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                                <span>Berpartisipasi aktif dalam kegiatan internasional di bidang meteorologi, klimatologi dan geofisika.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                
                <section id="tugas-fungsi" className="bg-white rounded-xl border border-bmkg-border p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-bmkg-navy pb-2 border-b border-gray-100">
                        Tugas Pokok & Fungsi Stasiun Klimatologi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 leading-relaxed">
                        <div className="space-y-2">
                            <h4 className="font-bold text-bmkg-primary text-xs">Tugas Pokok:</h4>
                            <p>
                                Melaksanakan pengamatan, pengumpulan dan penyebaran data, pengolahan, analisis dan prakiraan di bidang klimatologi dan kualitas udara serta pelayanan jasa klimatologi dan kualitas udara di wilayah kerjanya sesuai peraturan perundang-undangan.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-bmkg-primary text-xs">Fungsi:</h4>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Pengamatan unsur klimatologi dan kualitas udara secara berkesinambungan.</li>
                                <li>Pengumpulan dan pertukaran data pengamatan klimatologi dari pos hujan kerjasama.</li>
                                <li>Penyusunan analisis, prediksi musim, dan evaluasi hari tanpa hujan (HTH).</li>
                                <li>Pemeliharaan instrumen, peralatan AWS, dan kalibrasi sensor cuaca.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                
                <section id="pos-hujan" className="space-y-3">
                    <div className="border-b-2 border-bmkg-primary pb-2 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Persebaran Geografis
                            </span>
                            <h2 className="text-base font-extrabold text-bmkg-navy">
                                Peta Jaringan Pos Pengamatan & Curah Hujan Bone Bolango
                            </h2>
                        </div>
                    </div>
                    <ClimateMap />
                </section>

                
                <section id="sdm" className="space-y-4">
                    <div className="border-b-2 border-bmkg-primary pb-2 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-extrabold tracking-widest text-bmkg-secondary uppercase">
                                Personil & Jabatan
                            </span>
                            <h2 className="text-base font-extrabold text-bmkg-navy">
                                Sumber Daya Manusia Stasiun Klimatologi Bone Bolango
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {staffMembers.length > 0 ? (
                            staffMembers.map((staff) => (
                                <div 
                                    key={staff.id}
                                    className="bg-white rounded-xl border border-bmkg-border p-4 shadow-sm flex flex-col justify-between hover:border-bmkg-accent transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full border-2 border-bmkg-secondary/40 shadow-xs overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                                            <img 
                                                src={staff.avatar_url || (staff.gender === 'wanita' || staff.gender === 'perempuan' ? '/images/avatars/avatar_wanita_1.svg' : '/images/avatars/avatar_pria_1.svg')} 
                                                alt={staff.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    const target = e.currentTarget;
                                                    target.onerror = null;
                                                    target.src = '/images/avatars/avatar_pria_1.svg';
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-bmkg-navy leading-snug truncate" title={staff.name}>
                                                {staff.name}
                                            </h4>
                                            <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5" title={staff.jabatan || 'Pegawai BMKG'}>
                                                {staff.jabatan || 'Pegawai BMKG'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 text-[11px] text-gray-600 space-y-0.5">
                                        {staff.nip ? (
                                            <div className="text-[10px] text-gray-500 font-mono">NIP. {staff.nip}</div>
                                        ) : (
                                            <div className="text-[10px] text-gray-400">Pegawai Staklim Bone Bolango</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
                                Belum ada data personil terdaftar.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
