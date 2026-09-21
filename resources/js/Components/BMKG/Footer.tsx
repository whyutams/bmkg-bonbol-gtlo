import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    ExternalLink, 
    ShieldCheck, 
    Radio,
    FileCheck
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#0f172a] text-white font-sans border-t border-slate-800">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/e/e3/BMG_2003.png" 
                                    alt="BMKG" 
                                    className="w-9 h-9 object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                    Stasiun Klimatologi
                                </h3>
                                <p className="text-xs text-slate-300 font-medium">
                                    Bone Bolango - Gorontalo
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            Unit Pelaksana Teknis (UPT) BMKG yang bertugas melaksanakan pengamatan, pengumpulan, penyebaran data, dan pelayanan jasa klimatologi di wilayah Provinsi Gorontalo.
                        </p>

                        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span>Jl. Prof. Dr. Ing. B. J. Habibie, Desa Moutong, Kec. Tilongkabila, Kab. Bone Bolango, Gorontalo 96119</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>Senin - Jumat: 07:30 - 16:00 WITA</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-slate-400" />
                            <span>Layanan Publik (PTSP)</span>
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>
                                <Link href="/layanan#form" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Formulir Permintaan Data Online</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan#pnbp" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Tarif PNBP BMKG (PP 47/2018)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan#gratis" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Layanan Tarif Rp 0 (Gratis)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan#ikm" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Survey Indeks Kepuasan Masyarakat</span>
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href="https://wbs.bmkg.go.id" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <span>▸ Whistleblowing System BMKG</span>
                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                </a>
                            </li>
                        </ul>

                        <div className="pt-2">
                            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
                                <strong className="text-white">Zona Integritas:</strong> Menuju Wilayah Bebas dari Korupsi (WBK) & Wilayah Birokrasi Bersih Melayani (WBBM).
                            </div>
                        </div>
                    </div>

                    
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
                            <Radio className="w-4 h-4 text-slate-400" />
                            <span>Produk & Informasi</span>
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>
                                <Link href="/cuaca" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Prakiraan Cuaca Bone Bolango</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/cuaca#satelit" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Citra Satelit Himawari-9</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/iklim#hth" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Monitoring Hari Tanpa Hujan (HTH)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/iklim#analisis" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Analisis Curah Hujan Dasarian</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/gempa" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Gempabumi Terkini (M ≥ 5.0)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/iklim#buletin" className="hover:text-white flex items-center gap-1.5 transition-colors">
                                    <span>▸ Unduhan Buletin Iklim Bulanan</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Kontak & Pengaduan</span>
                        </h4>
                        
                        <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-slate-400 uppercase">Telepon / WhatsApp</span>
                                    <span className="font-mono font-medium text-white">0811-435-068</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div>
                                    <span className="block text-[10px] text-slate-400 uppercase">Email Resmi</span>
                                    <span className="text-white font-medium break-all">staklim.gorontalo@bmkg.go.id</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                </svg>
                                <div>
                                    <span className="block text-[10px] text-slate-400 uppercase">Media Sosial Resmi</span>
                                    <a 
                                        href="https://instagram.com/staklim.gorontalo" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-slate-300 hover:text-white underline font-medium"
                                    >
                                        @staklim.gorontalo
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href="tel:196"
                                    className="block w-full text-center py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition-colors text-xs"
                                >
                                    Emergency Call Center: <strong className="font-bold">196</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="bg-black/30 border-t border-slate-800/80 py-4 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div>
                        © {new Date().getFullYear()} <strong className="text-slate-300">Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</strong>. Hak Cipta Dilindungi.
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <Link href="/profil" className="hover:text-white transition-colors">Tentang Kami</Link>
                        <span>•</span>
                        <Link href="/layanan" className="hover:text-white transition-colors">Standar Pelayanan</Link>
                        <span>•</span>
                        <a href="https://www.bmkg.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Portal Nasional BMKG ↗</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
